# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Image Search Feature Setup

The image search functionality in this application requires a Google API Key and a Programmable Search Engine ID. Follow these steps to obtain and configure them.

### Step 1: Get a Google API Key (GOOGLE_API_KEY)

This key is used to authorize your requests to Google services.

1.  **Go to Google Cloud Console** and select a project or create a new one.
2.  From the left menu, navigate to **"APIs & Services" > "Library"**.
3.  Search for **"Custom Search API"**, click on the result, and **enable** it.
4.  After enabling the API, go to **"APIs & Services" > "Credentials"** from the left menu.
5.  Click on **"+ CREATE CREDENTIALS"** at the top and select **"API key"**.
6.  A new API key will be created. A dialog box will appear. **Copy the generated API key** and then click the **"EDIT API KEY"** button to go to the key's configuration page.
7.  On the key restrictions page, apply the following settings for security:
    *   **Application restrictions:** Leave this as **"None"**. Since the API call is made from the server-side, IP or website restrictions are not necessary for this setup.
    *   **API restrictions:** Select the **"Restrict key"** option. In the "Select APIs" dropdown that appears, find and select **"Custom Search API"**. This is a crucial security measure that ensures your key can only be used for this specific purpose.
8.  Click **"Save"**. The copied key is your `GOOGLE_API_KEY`.

### Step 2: Get a Programmable Search Engine ID (GOOGLE_CUSTOM_SEARCH_ENGINE_ID)

This ID tells Google which search engine configuration to use.

1.  Go to the **Programmable Search Engine** control panel: [https://programmablesearchengine.google.com/](https://programmablesearchengine.google.com/)
2.  Click **"Add"** to create a new search engine.
3.  On the setup screen, you will see a form. Fill it out as follows:
    *   **Name of the search engine:** You can enter any name here. This is for your reference only. Example: `Post Weaver Image Search`.
    *   **What to search?:** Select the **"Search the entire web"** option. Do *not* use the "Search specific sites" option.
    *   **Image search:** Toggle this switch to **ON**. This is crucial for the feature to work.
    *   **SafeSearch:** It is recommended to keep this toggled **ON**.
4.  Click the **"Create"** button.
5.  After creation, you will be taken to the control panel. On the "Basics" tab, you will find the **"Search engine ID"**. Copy this ID. This will be your `GOOGLE_CUSTOM_SEARCH_ENGINE_ID`.

### Final Step: Add the Keys to Your Project

Place the copied keys into the `.env` file located in the root directory of your project, like this:

```
GOOGLE_API_KEY="PASTE_YOUR_API_KEY_HERE"
GOOGLE_CUSTOM_SEARCH_ENGINE_ID="PASTE_YOUR_SEARCH_ENGINE_ID_HERE"
```

After completing these steps, the image search feature will work as expected.
