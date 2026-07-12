import { CloudWatchClient, GetMetricStatisticsCommand } from "@aws-sdk/client-cloudwatch";

const client = new CloudWatchClient({ region: process.env.AWS_REGION || "ap-southeast-1" });

/**
 * Mengambil data CPU Utilization (%) untuk sebuah instance selama N menit terakhir.
 */
export async function getCpuUtilization(instanceId, minutesBack = 60) {
  const endTime = new Date();
  const startTime = new Date(endTime.getTime() - minutesBack * 60 * 1000);

  const command = new GetMetricStatisticsCommand({
    Namespace: "AWS/EC2",
    MetricName: "CPUUtilization",
    Dimensions: [{ Name: "InstanceId", Value: instanceId }],
    StartTime: startTime,
    EndTime: endTime,
    Period: 300, // 5 menit
    Statistics: ["Average"],
    Unit: "Percent",
  });

  const response = await client.send(command);

  const points = (response.Datapoints || [])
    .sort((a, b) => new Date(a.Timestamp) - new Date(b.Timestamp))
    .map((dp) => ({
      timestamp: dp.Timestamp,
      value: Number(dp.Average?.toFixed(2) || 0),
    }));

  return points;
}
