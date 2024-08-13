// const AWS = require('@aws-sdk/core');
// const s3 = require('@aws-sdk/client-s3');
// const codepipeline = require('@aws-sdk/client-codepipeline');
// const s3 = new AWS.S3();
// const codepipeline = new AWS.CodePipeline();
const { exec } = require('child_process');
const path = '/opt/python/bin/'; // Path where the CLI will be available

exports.handler = async (event, context) => {
    console.log('event is 👉', JSON.stringify(event, null, 4));

    // const pipelineName = process.env.PIPELINE_NAME;
    const outputBucket = process.env.OUTPUT_BUCKET;
    const commitId = process.env.COMMIT_ID;
    const hostingBucket = process.env.HOSTING_BUCKET;

    await syncS3Buckets(outputBucket, commitId, hostingBucket);
    // await startPipeline(pipelineName);

};

async function syncS3Buckets(outputBucket, commitId, hostingBucket) {
    const command = `${path}aws s3 cp s3://${outputBucket}/${commitId}/ s3://${hostingBucket}/ --recursive --metadata revision=${commitId}`;

    // return new Promise((resolve, reject) => {        
    //     exec(command, (error, stdout, stderr) => {
    //         if (error) {
    //             reject(`Error: ${stderr}`);
    //             return;
    //         }
    //         console.log(`Output: ${stdout}`);
    //         // resolve(stdout);
    //     });

    //     resolve();
    // });

    try {
        exec(command, (error, stdout, stderr) => {
            if(error) {
                new Error(error, stderr)
            }

            console.log("Output", stdout)
        })
    } catch(err) {
        console.log(`Error syncing buckets ${pipelineName}: ${err}`);
        throw err;
    }
};

// async function startPipeline(pipelineName) {
//     const params = {
//         name: pipelineName
//     };

//     try {
//         await codepipeline.startPipelineExecution(params);
//         console.log(`Pipeline ${pipelineName} started`);
//     } catch (err) {
//         console.log(`Error starting pipeline ${pipelineName}: ${err}`);
//         throw err;
//     }
// };