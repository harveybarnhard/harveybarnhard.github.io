import dominate
from dominate.tags import *

# File to write
projectsHTML = open("../public/projects.html", "w")

# Create outer div and header
list = div(cls="main-content")
list += h1("Projects")

# Iterate through list of projects and create the div
for item in range(4):
    list += div(item, cls="hello")
print(list)

# Write the file
projectsHTML.write(list.render())
projectsHTML.close()
