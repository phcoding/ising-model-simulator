program main
    ! 
    ! ising module 2d simulation main function.
    ! 
    ! Usage: `ising [size] [temp] [magn] [steps] [times] [outfile]`
    ! Params:
    !   --[size]     lattic side length.
    !   --[temp]     temperature of system.
    !   --[magn]     magnet filed of system.
    !   --[steps]    steps of sampling in Monte Carlo.
    !   --[times]    sampling times.
    !   --[outfile]  optional, file to save simulation result of spin data.
    ! 
    ! Example: 
    !   cmd:
    !       `ising 64 2.27 0. 1000 10 spin.csv`
    !   out:
    !       Start simulating: 10
    !          Time    Energy
    !          1       -1.975586
    !          2       -1.974609
    !          3       -1.974609
    !          4       -1.979004
    !          5       -1.977539
    !          6       -1.976562
    !          7       -1.981445
    !          8       -1.986328
    !          9       -1.985840
    !          10      -1.986816
    !       Simulating finished !
    ! 
    ! Author: ph
    ! Email: huipan.hnu@qq.com
    ! Time: 2017.06.20
    ! 
    use util
    use ising
    implicit none

    type(spins) :: spin
    real :: temp, magn
    character(len=32) :: arg
    integer :: size, steps, times, i, narg

    narg = iargc()

    ! only if number of paramters is 5 or 6, program can be continued.
    if (narg /= 5 .and. narg /= 6) then
        write(*,"(A,/)") 'Error: number of args not fit !'
        call show_usage()
        stop
    endif

    ! get input command args.
    do i = 1, 5
        call getarg(i,arg)
        select case(i)
        case(1)
            read(arg, *) size
        case(2)
            read(arg, *) temp
        case(3)
            read(arg, *) magn
        case(4)
            read(arg, *) steps
        case(5)
            read(arg, *) times
        end select
    end do

    ! init spin site data.
    call init_spins(spin, size, temp, magn)

    ! start simulating.
    call ising_simulate(spin, steps,times)

    ! save result spin site data to file.
    if (narg .eq. 6) then
        call getarg(i,arg)
        open(unit=12, file=arg)
    endif
    call show_matrix(real(spin%data), 12)

    ! deallocate spin data.
    deallocate(spin%data)
    stop
end program main

subroutine show_usage()
    ! 
    ! show help message of this pogram.
    !
    implicit none
    write(*,"(A,/)") 'Usage: ising.exe [size] [temp] [magn] [steps] [times] [outfile]'
    write(*,"(A,/)") 'Params:'
    write(*,"(T4,A,/)") "--[size]     lattic side length."
    write(*,"(T4,A,/)") "--[temp]     temperature of system."
    write(*,"(T4,A,/)") "--[magn]     magnet filed of system."
    write(*,"(T4,A,/)") "--[steps]    steps of sampling in Monte Carlo."
    write(*,"(T4,A,/)") "--[times]    sampling times."
    write(*,"(T4,A,/)") "--[outfile]  file to save simulation result of spin data."
end subroutine show_usage
