import dominate
import pandas as pd
from dominate.tags import *
from dominate.util import raw

# File to write
outputHTML   = open("../public/projects_test.html", "w")

# Create sidebar
sidebar = raw(
  """
  <div class="sidebar">
    <button class="barlink" style="font-size:20px; cursor: auto;">Categories</button>
    <button class="barlink-item bar-active" onclick="openLink(event, 'projects-programming')">Programming</button>
    <button class="barlink-item" onclick="openLink(event, 'projects-papers')">Papers</button>
    <button class="barlink-item" onclick="openLink(event, 'projects-other')">Miscellany</button>
  </div>
  """
)

# Create outer div
outHTML = div()
main = div(cls="main-content")

# Create Programming div
file_prog = pd.read_csv("../posts/programming.csv")
div_prog = div(id="projects-programming", cls="category fade-anim")
for index, row in file_prog.iterrows():
    div_item = div(cls="post")
    div_item += div(row['Name'], cls="post-title")
    div_item += a("[GitHub]", href=row['GitHub Link'])
    div_item += div(row['Author'], cls="post-author")
    div_item += div(row['Date'], cls="post-date")
    div_prog += div_item
    print(div_item)

# Create Papers div
div_paper = div(id="projects-papers", cls="category fade-anim", style="display:none")
for item in range(4):
    div_paper += div(item, cls="hello")
# Create Miscellany div
div_misc = div(id="projects-other", cls="category fade-anim", style="display:none")
for item in range(4):
    div_misc += div(item, cls="hello")

# Add categories to main div
main += div_prog
main += div_paper
main += div_misc

# Append sidebar and main content
outHTML += sidebar
outHTML += main
print(outHTML)

# Write the file
outputHTML.write(outHTML.render())
outputHTML.close()
