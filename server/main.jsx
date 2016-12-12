import { Meteor } from 'meteor/meteor';
import { Picker} from 'meteor/meteorhacks:picker';
const uuid = Meteor.npmRequire('node-uuid');
const aws = Meteor.npmRequire('aws-sdk');


import { AWSAccessKeyId, AWSSecretKey } from './secrets';


Meteor.startup(() =>
{
    process.env.AWS_ACCESS_KEY_ID = AWSAccessKeyId;
    process.env.AWS_SECRET_ACCESS_KEY = AWSSecretKey;


    Picker.route('/s3/sign', function(params, req, res, next)
    {
        const S3_BUCKET = 'YOUR_BUCKET_NAME';   // change this to your bucket name
        let filename = params.query.objectName;
        let mimeType = params.query.contentType;
        let fileKey = filename;

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Content-Type', 'application/json');

        let s3 = new aws.S3({});
        let signParams = {
            Bucket: S3_BUCKET,
            Key: fileKey,
            Expires: 120,   // number of seconds
            ContentType: mimeType,
            ACL: 'private'
        };

        s3.getSignedUrl('putObject', signParams, function(err, data) {
            if (err) {
                console.log(err);
                res.statusCode = 500;
                res.end("Cannot create S3 signed URL");
            }
            else
            {
                res.statusCode = 200;

                res.end(JSON.stringify({
                    signedUrl: data,
                    publicUrl: '/s3/uploads/' + filename,
                    filename: filename
                }));
            }
        });
    });

});