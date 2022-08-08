<p align='center'>
<img alt='logo center' width='200' src='https://raw.githubusercontent.com/Avi98/bundle-analyser-ci/master/bundle-analyze/assets/logo.jpg' />
</p>

<p align=center>Azure custom task for measuring bundle size of your CRA project in every pull request</p>

<p align=center><img alt='badges' src='https://img.shields.io/github/license/Avi98/bundle-analyser-ci?label=License' /></p>

- **Commenting** the pull request with the bundle size using [source-map-explorer](https://www.npmjs.com/package/source-map-explorer).

<img alt='comment screenshot' src='https://raw.githubusercontent.com/Avi98/bundle-analyser-ci/master/bundle-analyze/assets/comment.png' />

## Usage

1. Install extension open this [link](https://marketplace.visualstudio.com/items?itemName=bundle-report.1629514b-06c5-4f3e-8a62-dc1c498f1726). Follow this [link](https://docs.microsoft.com/en-us/azure/devops/marketplace/get-tfs-extensions?view=azure-devops-2020) to install extension.
   > Note: This extension is not publicly available so please raise a issue with your Azure organization name to make it available for your organization.
2. Once the extension is install you can add it in your current pipeline by searching or manually adding it in the pipeline tasks.
3. To add the task you need to some variables also. You can view the description on next to the fields description.

   <img alt='variables' src='https://raw.githubusercontent.com/Avi98/bundle-analyser-ci/master/bundle-analyze/assets/addVariables.png'>

4. **Personal Access Token** is required to write comment on the pull request. Make sure the PAT token regrate should be have permission to read and write code.
5. For CRA apps the default path for build and static assets are 'build/static/js/\*.js'. That is the default path you can edit it if you want else leave it.
6. Base branch by default is master. There is [open issue](https://github.com/Avi98/bundle-analyser-ci/issues/3) for the features that are not there.

## Feedback

Pull requests, feature ideas and bug reports are very welcome. We highly appreciate any feedback.
