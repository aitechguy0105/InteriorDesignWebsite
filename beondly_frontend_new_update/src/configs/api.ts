export default {
  API: process.env.NEXT_PUBLIC_API,
  uploadImageEndpoint: '/upload-image/image/',
  imageTaggingEndpoint: '/generate-image/imageTagging/',
  videoTaggingEndpoint: '/generate-image/videoTagging/',
  videoTaggingStatusEndpoint: '/generate-image/videoTaggingStatus/',
  uploadVideoEndpoint: '/upload-image/video/',
  uploadMaskEndpoint: '/upload-image/mask/',
  uploadNoneMaskEndpoint: '/upload-image/none-mask/',
  getAllProjectEndpoint: '/generate-image/',
  getRestyleEndpoint: '/generate-image/get-restyle/',
  getStagingEndpoint: '/generate-image/get-staging/',
  generateRestyleEndpoint: '/generate-image/restyle/',
  generateByPromptEndpoint: '/generate-image/byPrompt',
  generateMaskRestyleEndpoint: '/generate-image/mask-restyle/',
  generateStagingEndpoint: '/generate-image/staging/',
  myProjectEndpoint: '/generate-image/my-project',
  myProjectRestyleEndpoint: '/generate-image/get-restyle-all/',
  myProjectStagingEndpoint: '/generate-image/get-staging-all/',
  getTagging: '/generate-image/getTagging/',
  downloadProject: '/generate-image/download',
  baseImageEndpoint: '/base-image/',
  roomStyleEndpoint: '/room-style/',
  Profile: '/users/',
  uploadAvatarEndpoint: '/upload-image/avatar/',
  userCount: '/users/count/',
  userPaginate: '/users/paginate/',
  deleteProect: '/generate-image/',
  testPoint: '/upload-image/test/',
  getUser: '/users/'
}
