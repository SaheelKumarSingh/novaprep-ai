import glob
import os

files = glob.glob("*.html")
for f in files:
    if f == "contact.html": continue
    
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # Update Nav Links to include Contact
    # We find the end of the nav-links div and insert the Contact link
    if 'href="contact.html"' not in content:
        nav_pattern = '                <a href="about.html">// About</a>'
        contact_link = '\n                <a href="contact.html">// Contact</a>'
        content = content.replace(nav_pattern, nav_pattern + contact_link)
    
    # Update Footer Contact Link
    # Usually it's <li><a href="#">Contact</a></li>
    content = content.replace('<li><a href="#">Contact</a></li>', '<li><a href="contact.html">Contact</a></li>')
        
    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)

print("Global Navigation and Footer Updates Complete")
