// const AWS = require('aws-sdk');
// const s3 = require('@aws-sdk/client-s3');
// const codepipeline = require('@aws-sdk/client-codepipeline');
// const s3 = new AWS.S3();
// const codepipeline = new AWS.CodePipeline();
// const { exec } = require('child_process');
// const util = require('util');

const { CodePipelineClient, PutJobSuccessResultCommand, PutJobFailureResultCommand } = require('@aws-sdk/client-codepipeline');
const codepipeline = new CodePipelineClient({});

const { S3Client, ListObjectsV2Command, CopyObjectCommand } = require("@aws-sdk/client-s3");
const s3 = new S3Client({});

exports.handler = async (event, context) => {
    console.log('event is 👉', JSON.stringify(event, null, 4));

    // const pipelineName = process.env.PIPELINE_NAME;
    const outputBucket = process.env.OUTPUT_BUCKET;
    const commitId = process.env.COMMIT_ID;
    const hostingBucket = process.env.HOSTING_BUCKET;

    try {
        await syncS3Buckets(outputBucket, commitId, hostingBucket);
        
        // Signal success to CodePipeline
        const command = new PutJobSuccessResultCommand({ jobId: event['CodePipeline.job'].id });
        await codepipeline.send(command);

    } catch (error) {
        console.error('Error:', error);

        // Signal failure to CodePipeline
        const command = new PutJobFailureResultCommand({ 
            jobId: event['CodePipeline.job'].id, 
            failureDetails: { 
                type: "JobFailed",
                message: "Sync buckets failed."
             } 
        });
        await codepipeline.send(command);
    }

};

async function syncS3Buckets(outputBucket, commitId, hostingBucket) {
    try {
        // List objects in the source bucket
        const listCommand = new ListObjectsV2Command({
            Bucket: outputBucket,
            Prefix: commitId
        });

        const listedObjects = await s3.send(listCommand);

        // Copy each object to the destination bucket
        for (const object of listedObjects.Contents || []) {
            const copyCommand = new CopyObjectCommand({
                CopySource: `${outputBucket}/${object.Key}`,
                Bucket: hostingBucket,
                Key: object.Key.replace(`${commitId}/`, ''),
                MetadataDirective: 'REPLACE',
                Metadata: {
                    'revision': commitId
                }
            });

            await s3.send(copyCommand);
            console.log(`Copied: ${object.Key}`);
        }

        console.log("Sync completed successfully");
    } catch (err) {
        console.error(`Error syncing buckets: ${err}`);
        throw err;
    }
}

// const execPromise = util.promisify(require('child_process').exec);

// async function syncS3Buckets(outputBucket, commitId, hostingBucket) {
//     const path = '/opt/python/bin/'; // Path where the CLI will be available
//     const command = `${path}aws s3 cp s3://${outputBucket}/${commitId}/ s3://${hostingBucket}/ --recursive --metadata revision=${commitId}`;
//     try {
//         const { stdout, stderr } = await execPromise(command);
//         console.log("Output:", stdout);
//         if (stderr) console.error("Error:", stderr);
//     } catch (err) {
//         console.error(`Error syncing buckets: ${err}`);
//         throw err;
//     }
// }
