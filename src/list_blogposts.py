import dominate
import pandas as pd
from dominate.tags import *
from dominate.util import raw

# File to write
outputHTML   = open("../public/blog.html", "w")

# Create outer div
outHTML = div(cls="main-content")
main = div()

# Create blog div, post by post
file_blog = pd.read_csv("../posts/blog_posts.csv")
div_blog = div(id="projects-programming", cls="category fade-anim")
div_blog += h1("Blog Posts")
for index, row in file_blog.iterrows():
    # Parse tags
    tags = str.split(row['Tags'])
    tags_class = "" # Initialize string of classes for future filtering
    div_tags = ul(cls="tag-list") # Initialize list of tags
    for tag in tags:
        div_tags += li(tag, cls="tag")
        tags_class += " tag-" + tag
    div_item = div(cls="post-preview" + tags_class)
    div_item += a(row['Title'], cls="post-title", href=row['Blog Link'])
    div_item += br()
    div_item += span(row['Author']  + ",", cls="post-author")
    div_item += span(row['Date'], cls="post-date")
    div_item += div_tags
    div_blog += div_item

# Add blog div to main div
main += div_blog

# Append sidebar and main content
outHTML += main
print(outHTML)

# Write the file
outputHTML.write(outHTML.render())
outputHTML.close()
