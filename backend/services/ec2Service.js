import {
  EC2Client,
  DescribeInstancesCommand,
  StartInstancesCommand,
  StopInstancesCommand,
  RebootInstancesCommand,
  TerminateInstancesCommand,
} from "@aws-sdk/client-ec2";

const client = new EC2Client({ region: process.env.AWS_REGION || "ap-southeast-1" });

/**
 * Mengambil nama dari tag "Name" jika ada, kalau tidak pakai instance id.
 */
function getNameTag(tags = []) {
  const nameTag = tags.find((t) => t.Key === "Name");
  return nameTag ? nameTag.Value : null;
}

function mapInstance(instance) {
  return {
    id: instance.InstanceId,
    name: getNameTag(instance.Tags) || instance.InstanceId,
    type: instance.InstanceType,
    state: instance.State?.Name || "unknown",
    az: instance.Placement?.AvailabilityZone || "-",
    publicIp: instance.PublicIpAddress || null,
    privateIp: instance.PrivateIpAddress || null,
    launchTime: instance.LaunchTime,
    platform: instance.PlatformDetails || "Linux/UNIX",
    tags: instance.Tags || [],
  };
}

export async function listInstances() {
  const command = new DescribeInstancesCommand({});
  const response = await client.send(command);

  const instances = [];
  for (const reservation of response.Reservations || []) {
    for (const instance of reservation.Instances || []) {
      instances.push(mapInstance(instance));
    }
  }
  return instances;
}

export async function startInstance(instanceId) {
  const command = new StartInstancesCommand({ InstanceIds: [instanceId] });
  return client.send(command);
}

export async function stopInstance(instanceId) {
  const command = new StopInstancesCommand({ InstanceIds: [instanceId] });
  return client.send(command);
}

export async function rebootInstance(instanceId) {
  const command = new RebootInstancesCommand({ InstanceIds: [instanceId] });
  return client.send(command);
}

export async function terminateInstance(instanceId) {
  const command = new TerminateInstancesCommand({ InstanceIds: [instanceId] });
  return client.send(command);
}
