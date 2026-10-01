with open('src/components/admin/UserManagementHub.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Fix 1: ensure useEffect is imported
if "import React, {" in c and "useEffect" not in c.split("import React, {")[1].split("}")[0]:
    c = c.replace("import React, {", "import React, { useEffect,", 1)
    print("[1] Added useEffect to import")

# Fix 2: fix className in category tabs
broken_tab = """          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setInternalTab(tab.id);
                if (onSelectTab) onSelectTab(tab.id);
              }}
              className={}
            >
              <Icon className={} />
              <span>{tab.label}</span>
              <span className={}>
                {tab.count}
              </span>
            </button>
          );"""

fixed_tab = """          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setInternalTab(tab.id);
                if (onSelectTab) onSelectTab(tab.id);
              }}
              className={`px-3 py-2 rounded-xl text-xs font-bold shrink-0 flex items-center gap-2 transition cursor-pointer border ${
                isActive
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800 hover:text-white'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${tab.color}`} />
              <span>{tab.label}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                isActive ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
              }`}>
                {tab.count}
              </span>
            </button>
          );"""

if broken_tab in c:
    c = c.replace(broken_tab, fixed_tab, 1)
    print("[2] Fixed tab buttons className")
else:
    print("[!] broken_tab not found")

with open('src/components/admin/UserManagementHub.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print("[✓] UserManagementHub.tsx updated!")
