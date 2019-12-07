# Voting Application
Enable eligible voters who cannot get to a voting station to vote online and view election results. 

## Getting Started
All of the files can be loaded with your browser. Copy the files to your local directory and open index.html.

### Prerequisites
A browser. Chrome was used for testing. 

### Installing
1. Go to https://github.com/ruthtech/password-generator and click on the "Clone or Download" button. 
2. Choose "Download ZIP". 
3. Unzip into a directory. If you're on Windows, open File Explorer and navigate to the download directory. Select the ZIP file, right click, and choose "Extract All". Accept the default location.
4. Once the file is unzipped, navigate to portfolio-master and use your browser to open index.html.


## Running the tests
No automated test suite has been created for these simple HTML and JS files but you can check Google Chrome's Developer Tools to see if there's any syntax errors. 

Manual tests were run as documented below.

### Invalid Input Tested
1. Negative password length
2. Password length > 128 characters
3. Password length not a number
4. At least one character type selected

### Function Tests
1. When the Generate button is clicked, does the generated password match what is expected (e.g. length, character types).
2. When the Copy button is clicked, was the password copied to the clipboard?

## Deployment
To deploy this on a live system, copy all of the files to your server. 

## Built With
* [Visual Studio Code] https://code.visualstudio.com/docs/setup/setup-overview
* [Visual Studio Code Extension "Open in Browser"] 
  * Open VS Code.
  * Open the extensions pane and search for open in browser.
  * Select the version written by TechER and click Install.
* [Google Chrome] (https://www.google.com/chrome/browser/desktop/index.html)
* [Google Markdown Viewer] (https://chrome.google.com/webstore/detail/markdown-viewer/ckkdlimhmcjmikdlpkmbgfkaikojcbjk?hl=en) 
  * This is a Google Chrome extension to render markdown files, such as README.md, locally before it is pushed to GitHub. 
* Bootstrap
  * [Bootstrap] (https://getbootstrap.com)


## Contributing
This project is not open to contributions.

## Versioning
This project does not use versions at this time. 

## Authors
Ruth Lee

## License
MIT

## Acknowledgments
Thanks to the following:
* [w3schools.com] https://www.w3schools.com 
  * For teaching me how to copy the text to the clipboard, how to access the form widgets' values, and how
  to pass those widgets' values into generator.js. 
* [HTML validator] https://validator.w3.org/#validate_by_input
  * For validating the HTML in index.html.
* [U of T Coding Bootcamp] https://bootcamp.learn.utoronto.ca/coding/
  * For teaching me Bootstrap, JavaScript, and the DOM. 
* [Bootstrap] (https://getbootstrap.com 
  * For all of their documentation about Bootstrap and Bootstrap itself.
* [Google Markdown Viewer] (https://chrome.google.com/webstore/detail/markdown-viewer/ckkdlimhmcjmikdlpkmbgfkaikojcbjk?hl=en) 
  * For rendering markdown files, such as README.md, locally to check them before Git is used to push them to GitHub.
  
