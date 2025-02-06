# semantic-release-web-ext

🦊📦🚀 `semantic-release-web-ext` is a set of plugins for `semantic-release` that automates
the process of publishing Firefox add-ons using the [web-ext](https://extensionworkshop.com/documentation/develop/getting-started-with-web-ext/) tool.
It ensures that your add-ons are released in a consistent and reliable manner.

## Installation

```sh
npm install --save-dev semantic-release-web-ext
```

## Example

Using defaults

```json
{
  "release": {
    "branches": ["master"],
    "plugins": [
      "@semantic-release/commit-analyzer",
      "@semantic-release/release-notes-generator",
      "semantic-release-web-ext",
      "@semantic-release/github"
    ]
  }
}
```

Providing configuration options. For example, publish artifacts in GitHub Releases.

```json
{
  "release": {
    "branches": ["master"],
    "plugins": [
      "@semantic-release/commit-analyzer",
      "@semantic-release/release-notes-generator",
      [
        "semantic-release-web-ext",
        {
          "artifactsDir": "extension-dist"
        }
      ],
      [
        "@semantic-release/github",
        {
          "assets": ["extension-dist/*"]
        }
      ]
    ]
  }
}
```

## Usage

The package implements the following plugins

### verifyConditions

Verifies the environment variables and plugin options, uses `web-ext` [`lint`](https://extensionworkshop.com/documentation/develop/web-ext-command-reference/#web-ext-lint) command to validate extensions manifest and source code files

### prepare

Updates `manifest.json` file with next version.

### publish

Publishes extension using `web-ext` [`sign`](https://extensionworkshop.com/documentation/develop/web-ext-command-reference/#web-ext-sign) command

## Configuration

| Config option     | Environment variable       | Default value                      | Description                                                                 |
| ----------------- | -------------------------- | ---------------------------------- | --------------------------------------------------------------------------- |
|                   | WEB_EXT_API_KEY            |                                    | **REQUIRED.** API key (JWT issuer) for accessing the addons.mozilla.org API |
|                   | WEB_EXT_API_SECRET         |                                    | **REQUIRED** API secret (JWT secret) from addons.mozilla.org API            |
| channel           | WEB_EXT_CHANNEL            | listed                             | publish channel, "listed" or "unlisted"                                     |
| sourceDir         | WEB_EXT_SOURCE_DIR         | dist                               | The directory of the extension's source code                                |
| artifactsDir      | WEB_EXT_ARTIFACTS_DIR      | artifacts                          | The path of a directory to save artifacts in                                |
| approvalTimeout   | WEB_EXT_APPROVAL_TIMEOUT   | web-ext lib default                | Number of milliseconds to wait for approval before giving up                |
| validationTimeout | WEB_EXT_VALIDATION_TIMEOUT | web-ext lib default                | Number of milliseconds to wait for validation before giving up              |
| amoBaseUrl        | WEB_EXT_AMO_BASE_URL       | https://addons.mozilla.org/api/v5/ | Add-on submission API base URL                                              |

## Similar plugins

- [semantic-release-firefox-add-on](https://github.com/tophat/semantic-release-firefox-add-on)
- [semantic-release-amo](https://github.com/iorate/semantic-release-amo)
- [semantic-release-firefox](https://github.com/felixfbecker/semantic-release-firefox)
