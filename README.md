Uploading a file to S3 with the React-Meteor stack.

# How to Run

## Setting up AWS
1. Create an AWS S3 **bucket**
2. Retrieve your AWS **credentials**
<br>
[![s.png](https://s29.postimg.org/700k0uqxj/image.png)](https://postimg.org/image/blwo97cgj/)
<br>

3. **Edit CORS Configuration** for your bucket to enable XHR stuff.
<br>

[![Screenshot at Dec 12 12-12-24.png](https://s30.postimg.org/d8uirfn29/Screenshot_at_Dec_12_12_12_24.png)](https://postimg.org/image/pnharrekd/)
<br>
<br>Here's a sample CORS configuration:
<br>
<br>
`<?xml version="1.0" encoding="UTF-8"?>
 <CORSConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
     <CORSRule>
         <AllowedOrigin>YOUR HOST URL</AllowedOrigin>
         <AllowedMethod>PUT</AllowedMethod>
         <AllowedMethod>POST</AllowedMethod>
         <AllowedMethod>GET</AllowedMethod>
         <MaxAgeSeconds>3000</MaxAgeSeconds>
         <AllowedHeader>content-disposition</AllowedHeader>
         <AllowedHeader>content-type</AllowedHeader>
         <AllowedHeader>x-amz-acl</AllowedHeader>
     </CORSRule>
     <CORSRule>
         <AllowedOrigin>*</AllowedOrigin>
         <AllowedMethod>GET</AllowedMethod>
         <MaxAgeSeconds>3000</MaxAgeSeconds>
         <AllowedHeader>Authorization</AllowedHeader>
     </CORSRule>
 </CORSConfiguration>`
 
Edit **bucket policy** so that uploaded files can be retrieved later without requiring signing the URL every single time.
<br>Here's a sample policy:<br><br>
`{
 	"Version": "2012-10-17",
 	"Statement": [
 		{
 			"Sid": "AddPerm",
 			"Effect": "Allow",
 			"Principal": "*",
 			"Action": [
 				"s3:GetObject"
 			],
 			"Resource": [
 				"arn:aws:s3:::outfit-generator/*"
 			]
 		}
 	]
 }`

## Setting Up the Code
The logic is quite straight-forward. But it took me a while to realize that node modules don't just work with Meteor out-of-the-box. Instead, one needs to `Meteor.npmRequire` them, and have them listed in a separate packages.json with exact versions for this to work. Luckily, just go through the following 3 steps and you'll be on your merry way.
1. Create `server/secrets.js` similar to the sample file `server/sampleSecrets.js` provided here. Fill in your AWS **credentials**.
2. Fill in your AWS **bucket name** in `client/main.jsx` and `server/main.jsx`.
3. Install packages by running the script `scripts/npmMeteorSetup.sh`.

Then simply run `meteor` in the directory, and BOOM you are ready to go. <br>It should look like this:
<br>

[![Screenshot at Dec 12 12-01-45.png](https://s27.postimg.org/o41nax3o3/Screenshot_at_Dec_12_12_01_45.png)](https://postimg.org/image/e6qmhuw27/)

# Stack
* Client-side: React
* Server-side: Meteor with Picker


# For your knowledge: how it works

AWS needs every upload to be **signed**.
<br>Imagine a Martian who wants to be beamed up by the mothership. Before beaming him up, the mothership needs to verify that he is in fact who he claims to be. This is the equivalent of an S3 upload **preflight**request (HTTP OPTIONS). This preflight request maps all the information about the file, the bucket and the sender's credentials into a key string (a.k.a. the **signing** process). If AWS accepts the key string, then within a short time window, every file that is consistent with the preflight information will be allowed to be uploaded.
<br>Only then, will the actual PUT requests follow.
<br>After the file has been uploaded, AWS needs to be explicitly configured to make this file public (if you so wish) so that retrieving this file does not require signing every time.

# For your entertainment: how I struggled to finally get this to work in the past 48 hours

* Couldn't use Node modules out of the box <br>=> installed npmRequire, a Meteor module that enables the usage of Node modules with a Meteor server
* imported aws-sdk and UUID with npmRequire 
* signing URL <br>=> no out-of-the-box libraries available for Meteor
* preflight didn't work <br>=> set CORS settings on AWS console
* preflight worked, but PUT didn't 
<br>=> there must be discrepancies between what is being signed and what is sent to AWS 
<br>=> setting ACL to private fixed it
* uploaded successfully but could not retrieve the uploaded image
<br>=> setting the bucket profile on AWS to be accessible by the public (i.e. GET requests don't need to be signed every time)

Yes, I am bald now, thanks to all the hair-pulling.
    
## Sources
* Many thanks to the guys at FounderLab for creating [DropzoneS3Uploader](https://github.com/founderlab/react-dropzone-s3-uploader), which is used on the client-side for this project.
* [Picker](https://github.com/meteorhacks/picker) for Meteor server-side routing.
* [Meteor Npm](https://github.com/meteorhacks/npm) for using Node modules on Meteor server.


<br>
<br>
<br>
<br>
<br>
<br>

<sup>Because someone taught me to publish my work in forms of meaningful packages that can be of use to others.</sup>