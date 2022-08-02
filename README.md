# How to run the project

Add a file `.env.local` at the root containing `VITE_PHOTO_API_KEY=<id of the XXX api>`.  
Then run with `yarn` and `yarn dev`.  

# Interview

## Context
You're in the process of joining the XXX team, this test will help us to know more about the way you work and you communicate. The goal is for us to know better your work habits, the way you arbitrage, communicate and code. We'd like to avoid taking too much of your time, so don't spend more than 3 hours. We can accept an unfinished project, as long as it displays quality and it's well explained.

## Assignment
You'll have to create an app that removes the background from images using
XXX API.
The app needs to offer a way to pick a picture before sending it to an online API, and
then show the image result in the app. It'll also display a list of images previously
sent to the API.

### User stories
Here are the user stories by order of priority, i.e. what users must be able to
accomplish with the app:
1. As a user, I can upload an image from my computer. It will be sent to the server,
which will return an image without the background
2. As a user, I can see the list of images previously sent to the server from my
computer. They all appear in an "Untitled Folder" folder by default.
3. As a user, I can create folders
4. As a user, I can move images between folders. An image can only be in one
folder at a time.
5. As a a user, when I refresh the page, the folders and images are still showing
(using Local Storage or this library)
6. (Optional) As a user, I can rename folders
