Content in this folder is intended to be automatically sourced and used by builds on Netlify.

The functions folder exists to host custom functions hosted by Netlify. Currently, the ones present are automatically
triggered when one of Netlify's events match the name of the function file.
See: https://docs.netlify.com/functions/trigger-on-events/ for more information. The purpose of these triggered events
is to have a more accurate metric of when a build is actually complete, compared to Gatsby plugins' native setup.
