import React from 'react';
import ReactDOM from 'react-dom';
const Component = React.Component;
import DropzoneS3Uploader from 'react-dropzone-s3-uploader';


class Uploader extends Component {

    handleFinishedUpload() {
        Bert.alert('File uploaded successfully!', 'success');
    }

    render() {
        const S3_BUCKET_URL = 'https://s3-us-west-1.amazonaws.com/your_bucket_name';    // also make sure the region matches by checking against the AWS console for your bucket

        const style = {
            height: 200,
            border: 'dashed 2px #999',
            borderRadius: 5,
            position: 'relative',
            cursor: 'pointer',
        };

        const uploaderProps = {
            style,
            maxFileSize: 1024 * 1024 * 50,
            s3Url: S3_BUCKET_URL,
            signingUrlQueryParams: {uploadType: 'avatar'},
        };

        return (
            <DropzoneS3Uploader onFinish={this.handleFinishedUpload} {...uploaderProps} />
        )
    }
}

Meteor.startup(() =>
{
    ReactDOM.render(<Uploader />, document.querySelector('.reactContainer'));
});