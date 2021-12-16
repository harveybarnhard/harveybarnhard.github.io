import dominate
import pandas as pd
from dominate.tags import *
from dominate.util import raw

# File to write
outputHTML   = open("public/projects.html", "w")

# Create sidebar
sidebar = raw(
  """
  <div class="sidebar">
    <button class="barlink-item bar-active" onclick="openLink(event, 'projects-programming')"><i class="fas fa-code"></i> Programming</button>
    <button class="barlink-item" onclick="openLink(event, 'projects-papers')"><i class="fas fa-scroll"></i> Papers</button>
  </div>
  """
)

# Create outer div
outHTML = div(cls="main-content")
main = div(cls="main-content-previews")

# Create Programming div
file_prog = pd.read_csv("posts/programming.csv")
div_prog = div(id="projects-programming", cls="category fade-anim")
div_prog += h1("Programming")
for index, row in file_prog.iterrows():
    # Parse tags
    tags = str.split(row['Tags'])
    tags_class = "" # Initialize string of classes for future filtering
    div_tags = ul(cls="tag-list") # Initialize list of tags
    for tag in tags:
        div_tags += li(tag, cls="tag")
        tags_class += " tag-" + tag
    div_item = div(cls="post-preview")
    div_item += div(row['Name'], cls="post-title")
    div_item += a("[GitHub]", href=row['GitHub Link'], cls="link-github")
    if row['Blog Link'] != 'none':
        div_item += a("[Blog Post]", href=row['Blog Link'], cls="link-blog")
    div_item += br()
    div_item += p(row['Description'], cls="post-description")
    div_item += raw("""<i class="fas fa-user-edit"></i>""")
    div_item += span(row['Author'], cls="post-author")
    div_item += raw("""&nbsp;&nbsp;<i class="far fa-calendar-alt"></i>""")
    div_item += span(row['Date'], cls="post-date")
    div_item += div_tags
    div_prog += div_item

# Create Papers div
file_papers = pd.read_csv("posts/papers.csv")
div_paper = div(id="projects-papers", cls="category fade-anim", style="display:none")
div_paper += h1("Papers")
for index, row in file_papers.iterrows():
    div_item = div(cls="post-preview")
    div_item += div(row['Title'], cls="post-title")
    div_item += a("[PDF]", href=row['PDF Link'], cls="link-pdf")
    div_item += br()
    div_item += p(row['Description'], cls="post-description")
    div_item += raw("""<i class="fas fa-user-edit"></i>""")
    div_item += span(row['Author']  + ",", cls="post-author")
    div_item += raw("""&nbsp;&nbsp;<i class="far fa-calendar-alt"></i>""")
    div_item += span(row['Date'], cls="post-date")
    div_item += span("(" + row['Context'] + ")", cls="post-context")
    div_paper += div_item

# Add categories to main div
main += div_prog
main += div_paper
# Append sidebar and main content
outHTML += sidebar
outHTML += main
print(outHTML)

# Write the file
outputHTML.write(outHTML.render())
outputHTML.close()
