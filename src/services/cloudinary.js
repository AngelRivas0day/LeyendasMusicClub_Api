const cloudinary = require('cloudinary');

cloudinary.config({
    cloud_name: 'drs3muxpe',
    api_key: '427888411179184',
    api_secret: 'WmEyZ_4pcGfxZqMRhD0KdgXCbdw'
});

exports.uploads = (file, folder) => {
    return new Promise(resolve => {
        cloudinary.uploader.upload(file, (result) => {
            resolve({
                url: result.url,
                id: result.public_id
            })
        }, {
            resource_type: "auto",
            folder: folder
        })
    })
}

exports.delete = (id) => {
    return new Promise((resolve, reject) => {
        const result = cloudinary.uploader.destroy(id);
        resolve(result);
    })
}