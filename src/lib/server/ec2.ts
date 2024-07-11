import { env } from '$env/dynamic/private';
import { AllocateAddressCommand, AssociateAddressCommand, DescribeInstancesCommand, DescribeNetworkInterfacesCommand, DisassociateAddressCommand, EC2, ReleaseAddressCommand, StartInstancesCommand, StopInstancesCommand } from "@aws-sdk/client-ec2";
import { updateDnsRecord } from './dns';
import { sleep } from '$lib/promise';

export const ec2 = new EC2({
    credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY
    },
    region: env.AWS_REGION,
})

export async function start() {
    return await ec2.send(
        new StartInstancesCommand({
            InstanceIds: [
                env.FABRIC_INSTANCE_ID
            ]
        })
    )
}

export async function stop() {

    // Release ipv4 first
    await toggleIpv4(false)
    await sleep(1000)
    return await ec2.send(
        new StopInstancesCommand({
            InstanceIds: [
                env.FABRIC_INSTANCE_ID
            ]
        })
    )
}

export async function getStatus() {
    const res = await ec2.send(
        new DescribeInstancesCommand({
            InstanceIds: [
                env.FABRIC_INSTANCE_ID
            ]
        })
    )

    const instance = res.Reservations?.at(0)?.Instances?.at(0)
    if (!instance) {
        throw new Error('Instance not found')
    }
    const status = instance.State?.Name ?? 'unknown'
    const ipv4 = instance.PublicIpAddress
    const ipv6 = instance.Ipv6Address

    return {
        status: status as InstanceStatus,
        ipv4,
        ipv6,
    }
}

export async function toggleIpv4(useIPv4: boolean = false) {
    const { ipv4, status } = await getStatus()

    // We can't attach ip if the instance is down
    if (status !== "running") {
        return "instance is down"
    }

    if (ipv4 !== undefined && useIPv4 === true) {
        return "already have an ipv4"// Already have one
    }

    if (ipv4 === undefined && useIPv4 === false) {
        return "already don't have any"// Already dont't have any
    }

    if (useIPv4) {
        const { PublicIp, AllocationId } = await ec2.send(new AllocateAddressCommand())
        if (!PublicIp) {
            throw new Error("idk")
        }
        console.log(`allocated ip:${PublicIp}`)
        await Promise.all([
            updateDnsRecord(PublicIp),
            ec2.send(new AssociateAddressCommand({
                NetworkInterfaceId: env.FABRIC_MAIN_ENI_ID,
                AllocationId: AllocationId,
            }))
        ])
    } else {
        const { NetworkInterfaces } = await ec2.send(new DescribeNetworkInterfacesCommand({
            NetworkInterfaceIds: [
                env.FABRIC_MAIN_ENI_ID
            ],
        }))
        const { AssociationId, AllocationId } = NetworkInterfaces!.at(0)!.Association!
        console.log(NetworkInterfaces)
        await ec2.send(new DisassociateAddressCommand({
            AssociationId
        }))
        await sleep(1000)
        await ec2.send(new ReleaseAddressCommand({
            AllocationId
        }))
    }

    return "ok"
}

export function autoFix() {
    // We need to store all allocation id somewhere: ec2
    // Then need to check if it's match macchine state | Only no ipv4 state can be check
    // If there is not yet release IP -> release it

}


export type EC2Status = Awaited<ReturnType<typeof getStatus>>
export type InstanceStatus = "pending" | "running" | "shutting-down" | "stopped" | "stopping" | "terminated" | "unknown"