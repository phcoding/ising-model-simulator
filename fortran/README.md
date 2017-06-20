# Ising model 2d simulator for fortran

### File introduce
> `ising.f90`:      ising model simulation module file.<br>
> `ising_main.f90`: ising simulation main program.<br>
> `util.f90`:       util module with some useful function.<br>
> `build.cmd`:      cmd file on windows for building `ising_main.f90`.<br>
> `ising_plot.py`:  code to show spin site state based on python.<br>
> `runtime.f90`:    a simple util to execute command and get running time.<\br>

### Usage and demo
1. compile `ising_main.90`
> `gfortran ising.f90 util.f90 ising_main.f90 -o ising`

2. start ising simulation
> usage: `ising [size] [temp] [magn] [steps] [times] [outfile]`<br>
> example: `ising 256 2.27 0. 100000 10 spin.csv`<br>
> ![demo_cmd](./img/demo_cmd.png)

3. plot simulation result of spin site.
> usage: `python3 [spin site file]`<br>
> example:  `python3 spin.csv`<br>
> ![demo_spin](./img/demo_spin.png)

4. usage of runtime
> usage: `runtime [command]`.<br>
> example: `runtime ising 256 2.27 0. 100000 10`<br>
> ![demo_runtime](./img/demo_runtime.png)<br>
> It takes about 1.844s for this simulation. We can use it to test our program.
