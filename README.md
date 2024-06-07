# Fabrik Spatial App

The boilerplate is almost the absolute minimum that you need to get React Three Fiber to display a Three.js scene. We will make many additions to the boilerplate as we progress with the lessons.

# Create a project folder 

Open a command/terminal prompt and create a new folder on your system somewhere.

```mkdir react-three-fiber-boilerplate ```

# CD into the new folder

```cd react-three-fiber-boilerplate```

# Clone the repository 
```git clone https://github.com/fabrik-space/spatial-app-boilerplate.git```


# Setup development environment 
# VSCode 

To begin, we should ensure that we've set up an IDE (Integrated Development Environment) to develop with.
If you don't have VSCode already installed, then you can install it from - [VScode](https://code.visualstudio.com.) 

# NodeJS
We also need Node.js, which includes NPM, since we will be using the npm and npx commands.
To check if Node.js is already installed, open a cmd/terminal/shell prompt and type,

```node -v```
You should get a response indicating a version number
For example 

```v18.14.0```
Your version should be equal to or higher than v18.0.0.

We can also check the version of NPM,
```npm -v```
You want to see no error, but instead a version number equal to, or higher than v8.0.0.

# Run the app
Once you have setup the devlopemnt environment, Open the project on VSCode. Make sure you are under the project folder if not ```cd spatial-app-boilerplate```, 
Now open a new terminal within VScode and install all dependencies using

```npm install```

To run the application with local devlopement server
```npm run dev```

<img width="1429" alt="Screenshot 2024-05-16 at 12 08 53 PM" src="https://github.com/fabrik-space/spatial-app-boilerplate/assets/67771257/1a977f72-8ceb-4c37-aa75-c7e2574aee16">

You should be able to see a red color cube on canvas, you can interact and get started with it

Within you're terminal you should see 
```spatial-app-boilerplate git:(main)```

Which means you're under the main branch of the project,
Checkout from the current main branch to a new branch where you can start making changes 
```git checkout -b "your-branch-name"```

Based on the module you start, Replace "your-branch-name" with a preffered branch name and associated task for example :
```git checkout -b "module-1/upload-model"```

Once done with changes you can raise a pull request against the main branch and request review


