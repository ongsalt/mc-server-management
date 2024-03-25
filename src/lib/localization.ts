import type { InstanceStatus } from "./server/ec2";

export const statusDisplayText: Record<InstanceStatus, string> = {
    "pending": "กำลังเปิด",
    "running": "เปิด",
    "shutting-down": "กำลังปิด",
    "stopped": "ปิด",
    "stopping": "กำลังปิด",
    "terminated": "พัง",
    "unknown": "ไม่รู้"
}
