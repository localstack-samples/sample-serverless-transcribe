// This function is triggered by an HTTP request using the GET method.
// This function returns a HTML page with a form to upload a file to S3 and a list of files in the S3 bucket. 
exports.get = async (event) => {
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>File Upload Example</title>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.4/jquery.min.js"></script>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-KK94CHFLLe+nY2dmCWGMq91rCGa5gtU4mk92HdvYe+M/SXH301p5ILy+dN9+nJOZ" crossorigin="anonymous">
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ENjdO4Dr2bkBIFxQpeoTz1HIcje39Wm4jDKdf19U8gI4ddQ3GYNS7NTKfAdVQSZe" crossorigin="anonymous"></script>
    </head>
    <body class="p-3">
        <div>
            <a class="btn btn-md btn-primary" href="/local/job">List all jobs</a>
        </div>
        <br>
        <br>
        <h1>AWS Transcribe Example</h1>
        <p>This example shows how we can use an audio file to transcribe it to a json via s3 buckets and notify the user on its completion.</p>
        <form id="uploadForm">
            <input class="form-control" type="file" id="fileInput" name="fileInput">
            <input class="mt-4 btn btn-md btn-primary" type="submit" value="Upload">
        </form>    
        <script>
            $(function() {
                $('#uploadForm').on('submit', sendFile);
            });
    
            function sendFile(e) {
                e.preventDefault();
                var theFormFile = $('#fileInput').get()[0].files[0];
                $.ajax({
                    url: '/local/presign',
                    type: 'GET',
                    dataType: 'json',
                    data: {
                        filename: theFormFile.name,
                    },
                    success: function(data) {
                        var presignedUrl = data.url;
    
                        fetch(presignedUrl, {
                            method: 'PUT',
                            body: theFormFile,
                            headers: {
                            'Content-Type': theFormFile.type
                            }
                        })
                        .then(response => {
                            if (response.ok) {
                                alert('File uploaded successfully!');
                            } else {
                                alert('File upload failed!');
                                console.log('Error uploading file:', response.statusText);
                            }
                        })
                        .catch(error => {
                            alert('File could not be uploaded!');
                            console.log('Error uploading file:', error);
                        });
                    }
                });
            }
        </script>
    </body>
    </html>
`

    return {
        statusCode: 200,
        headers: {
            "Content-Type": "text/html",
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        body: html,
    };
};
