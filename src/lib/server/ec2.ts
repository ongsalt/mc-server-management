import { env } from '$env/dynamic/private';
import { DescribeInstancesCommand, EC2, StartInstancesCommand, StopInstancesCommand } from "@aws-sdk/client-ec2";

export const ec2 = new EC2({
    credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY
    },
    region: 'ap-southeast-1'
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

    switch (instance.State?.Name) {
        case "pending":
        case "running":
        case "shutting-down":
        case "stopped":
        case "stopping":
        case "terminated":
    }

    return {
        status: status as InstanceStatus,
        ipv4,
        ipv6
    }
}

export type InstanceStatus =  "pending" | "running" | "shutting-down" | "stopped" | "stopping" | "terminated" | "unknown"