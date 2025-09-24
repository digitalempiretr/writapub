# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Image Search Feature Setup (Pexels API)

The image search functionality in this application uses the Pexels API. Follow these steps to obtain and configure your API key.

### Step 1: Get a Pexels API Key (PEXELS_API_KEY)

This key is used to authorize your requests to the Pexels API.

1.  **Go to the Pexels API website:** [https://www.pexels.com/api/](https://www.pexels.com/api/)
2.  **Sign up or log in** to your Pexels account. If you don't have one, you can create one for free.
3.  Once logged in, navigate to the API key section of your profile or click the **"Get Your API Key"** button on the API homepage.
4.  You will be prompted to provide some information about your app. After filling it out, Pexels will generate an API key for you.
5.  **Copy the generated API key.** This is your `PEXELS_API_KEY`.

### Final Step: Add the Key to Your Project

Place the copied key into the `.env` file located in the root directory of your project, like this:

```
PEXELS_API_KEY="PASTE_YOUR_API_KEY_HERE"
```

After completing these steps, the image search feature will work as expected using Pexels.
