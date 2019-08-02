exports.getVideo = async (req, res, next) => {
    res.status(200).json({video: 'this is getVideo'});
}