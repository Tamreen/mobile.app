
## How to install?
- Install node.js, npm, bower, cordova, ionic.
- In the application root directory (tamreen), run the command <code>npm install</code>.
- In the application root directory (tamreen), run the command <code>bower install</code>.
- In the directory <code>www/js</code>, duplicate the file <code>configs.template.js</code> and give the new file the name <code>configs.js</code>.
- Run <code>./init_ios.sh</code>.
- Run <code>ionic emulate ios</code> for iOS.
- If you want to test it on Android, you must install Genymotion, and have inside it any Android device (e.g. Nexus 5), and then keep it running.
- Run <code>ionic run android</code> for Android.

## How to build a release?
- <code>cordova build --release</code>.
- <code>jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore keys/TamreenApp.keystore platforms/android/ant-build/CordovaApp-release-unsigned.apk TamreenApp</code>.
- <code>/Users/hossamzee/android-sdk-macosx/build-tools/21.1.2/zipalign -v 4 platforms/android/ant-build/CordovaApp-release-unsigned.apk TamreenApp1.0.1.apk</code>.

## TODO:
- Tell the user about the current state of the app, e.g. Loading..., etc.
- Check the deviceType value sometimes it happens to be null.
- Check every pullToRefresh method to respond to the current view.
- Take some beautiful screenshots for the app to market it.
- Mention that the faces are randomly generated, they do not mean anything personal.