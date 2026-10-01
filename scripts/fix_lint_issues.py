# 1. CustomerDashboard.tsx
with open('src/components/CustomerDashboard.tsx', 'r', encoding='utf-8') as f:
    cd = f.read()

if "import React, {" in cd and "useMemo" not in cd.split("import React, {")[1].split("}")[0]:
    cd = cd.replace("import React, {", "import React, { useMemo,", 1)
    with open('src/components/CustomerDashboard.tsx', 'w', encoding='utf-8') as f:
        f.write(cd)
    print("[✓] Added useMemo to CustomerDashboard.tsx")

# 2. MarketplaceSection.tsx
with open('src/components/MarketplaceSection.tsx', 'r', encoding='utf-8') as f:
    ms = f.read()

# Locate myCreatedPostIds block
decl_block = """  // লোকাল সেশনে বায়ারের ক্রিয়েট করা পোস্ট আইডিসমূহ
  const [myCreatedPostIds, setMyCreatedPostIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('ptenit_my_buyer_post_ids');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  });"""

# Remove decl_block from current position
if decl_block in ms:
    ms = ms.replace(decl_block, "", 1)
    # Insert decl_block before isMyBuyerOrder
    target = "  const isMyBuyerOrder = useCallback((o: MarketplaceOrder) => {"
    ms = ms.replace(target, decl_block + "\n\n" + target, 1)
    with open('src/components/MarketplaceSection.tsx', 'w', encoding='utf-8') as f:
        f.write(ms)
    print("[✓] Moved myCreatedPostIds before isMyBuyerOrder in MarketplaceSection.tsx")
else:
    print("[!] decl_block not found in MarketplaceSection.tsx")
