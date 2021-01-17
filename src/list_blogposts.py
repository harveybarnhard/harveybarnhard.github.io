import dominate
import pandas as pd
from dominate.tags import *
from dominate.util import raw
import datetime

# File to write
outputHTML   = open("../public/blog.html", "w")

# Create sidebar
sidebar = raw(
  """
  <div class="sidebar" id="sidebar-blog">
    <button class="barlink" style="font-size:20px; cursor: auto;">Sections</button>
    <button class="barlink-item bar-active" onclick="openLink(event, 'blog-posts')"><i class="fas fa-pencil-alt"></i> Blog Posts</button>
    <button class="barlink-item" onclick="openLink(event, 'blog-books')"><i class="fas fa-book"></i> Books</button>
  </div>
  """
)

# Create outer div
outHTML = div(cls="main-content")
main = div(cls="main-content-previews")

# Create blog post div, post by post
file_blog = pd.read_csv("../posts/blog_posts.csv")
file_blog['Date'] = pd.to_datetime(file_blog['Date'])
file_blog['Date'] = file_blog['Date'].dt.strftime('%B %d, %Y')
div_blog = div(id="blog-posts", cls="category fade-anim")
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
    div_item += raw("""<i class="fas fa-user-edit"></i>""")
    div_item += span(row['Author'], cls="post-author")
    div_item += raw("""&nbsp;&nbsp;<i class="far fa-calendar-alt"></i>""")
    div_item += span(row['Date'], cls="post-date")
    div_item += div_tags
    div_blog += div_item

# Create books div, book by book
file_book = pd.read_csv('https://raw.githubusercontent.com/harveybarnhard/personal-goals/main/data/raw/books.csv')
file_book['date_finished'] = pd.to_datetime(file_book['date_finished'])
file_book['date_finished'] = file_book['date_finished'].dt.strftime('%B %d, %Y')
div_book = div(id="blog-books", cls="category fade-anim", style="display:none")
div_book += h1("Books I've Read")
for index, row in file_book.iterrows():
    # Parse tags
    tags = str.split(row['tags'])
    tags_class = "" # Initialize string of classes for future filtering
    div_tags = ul(cls="tag-list") # Initialize list of tags
    for tag in tags:
        div_tags += li(tag, cls="tag")
        tags_class += " tag-" + tag
    div_item = div(cls="post-preview" + tags_class)
    div_item += a(row['title'], cls="post-title", href=row['gr_link'])
    div_item += br()
    div_item += p(row['subtitle'], cls="post-description")
    div_item += raw("""<i class="fas fa-user-edit"></i>""")
    div_item += span(row['author'], cls="post-author")
    div_item += raw("""&nbsp;&nbsp;<i class="far fa-calendar-alt"></i>""")
    div_item += span("Date read: " + row['date_finished'], cls="post-date")
    div_item += div_tags
    div_book += div_item
# Add blog div to main div
main += div_blog
main += div_book
# Append sidebar and main content
outHTML += sidebar
outHTML += main
print(outHTML)

# Write the file
outputHTML.write(outHTML.render())
outputHTML.close()
