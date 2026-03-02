import sys

file_path = 'Frontend/src/Component/Home/JobSearchSection.tsx'

with open(file_path, 'r') as f:
    lines = f.readlines()

out_lines = []
skip = False
conflict_mode = 0

for i in range(len(lines)):
    line = lines[i]
    if line.startswith('<<<<<<< Updated upstream'):
        skip = True
        conflict_mode = 1
        continue
    elif line.startswith('======='):
        conflict_mode = 2
        continue
    elif line.startswith('>>>>>>> Stashed changes'):
        skip = False
        conflict_mode = 0
        continue
    
    if skip:
        if conflict_mode == 1:
            out_lines.append(line)
    else:
        if 'className="bg-white text-[#0122c5] border-2 border-[#0122c5]' in line:
            line = line.replace('className="bg-white text-[#0122c5] border-2 border-[#0122c5] hover:bg-[#0122c5] hover:text-white text-[13px] font-bold px-8 py-2 rounded-full transition-colors whitespace-nowrap shadow-sm hover:shadow-md outline-none focus:outline-none"',
            'className="bg-white text-[#0122c5] border border-[#0122c5] hover:bg-[#0122c5] hover:text-white text-[13px] font-semibold px-6 py-2 rounded-full transition-colors whitespace-nowrap shadow-sm hover:shadow-md outline-none focus:outline-none"')
        out_lines.append(line)

with open(file_path, 'w') as f:
    f.writelines(out_lines)
