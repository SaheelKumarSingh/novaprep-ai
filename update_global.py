import glob
import re

files = glob.glob("*.html")
for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # Update Nav Links
    content = content.replace('>Pricing</a>', '>Plans</a>')
    content = content.replace('>// Pricing</a>', '>// Plans</a>')
    
    # Update Footer Text
    if 'NovaPrep is currently in beta' not in content:
        # We append before the closing </div> of .footer-bottom and </footer>
        # Usually it looks like:
        #         </div>
        #     </footer>
        footer_disclaimer = '\n            <div style="font-size: 0.75rem; color: var(--text-dim); width: 100%; text-align: center; margin-top: 0.5rem;">\n                NovaPrep is currently in beta. Features may evolve before launch.\n            </div>\n        </div>\n    </footer>'
        content = content.replace('        </div>\n    </footer>', footer_disclaimer)
        
    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)

print("Global Updates Complete")
