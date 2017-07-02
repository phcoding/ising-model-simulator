subroutine show_usage()
    ! 
    ! show help message of this pogram.
    !
    implicit none
    write(*,"(A,/)") 'Usage: ising.exe [rows] [cols] [temp] [magn] [steps] [times] [outfile]'
    write(*,"(A,/)") 'Params:'
    write(*,"(T4,A,/)") "--[rows]     lattic system rows."
    write(*,"(T4,A,/)") "--[cols]     lattic system cols."
    write(*,"(T4,A,/)") "--[temp]     temperature of system."
    write(*,"(T4,A,/)") "--[magn]     magnet filed of system."
    write(*,"(T4,A,/)") "--[steps]    steps of sampling in Monte Carlo."
    write(*,"(T4,A,/)") "--[times]    sampling times."
    write(*,"(T4,A,/)") "--[outfile]  file to save simulation result of spin data."
end subroutine show_usage

program main
    ! 
    ! ising module 2d simulation main function.
    ! 
    ! Usage: `ising [rows] [cols] [temp] [magn] [steps] [times] [outfile]`
    ! Params:
    !   --[rows]     lattic system rows.
    !   --[cols]     lattic system cols.
    !   --[temp]     temperature of system.
    !   --[magn]     magnet filed of system.
    !   --[steps]    steps of sampling in Monte Carlo.
    !   --[times]    sampling times.
    !   --[outfile]  optional, file to save simulation result of spin data.
    ! 
    ! Example: 
    !   cmd:
    !       `ising 64 64 2.27 0. 1000 10 spin.csv`
    !   out:
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
    ! 
    ! Author: ph
    ! Email: huipan.hnu@qq.com
    ! Date: 2017.06.20
    ! 
    use util
    use ising
    use handle
    implicit none

    type(spins) :: spin
    real :: temp, magn
    character(len=32) :: arg
    integer :: rows, cols, steps, times, i, narg

    narg = iargc()

    ! only if number of paramters is 5 or 6, program can be continued.
    if (narg /= 6 .and. narg /= 7) then
        write(*,"(A,/)") 'Error: number of args not fit !'
        call show_usage()
        stop
    endif

    ! get input command args.
    do i = 1, 6
        call getarg(i,arg)
        select case(i)
        case(1)
            read(arg, *) rows
        case(2)
            read(arg, *) cols
        case(3)
            read(arg, *) temp
        case(4)
            read(arg, *) magn
        case(5)
            read(arg, *) steps
        case(6)
            read(arg, *) times
        end select
    end do

    ! init spin site data.
    call init_spins(spin, rows, cols, temp, magn)

    ! start simulating.
    call ising_simulate(spin, steps, times, update)

    ! save result spin site data to file.
    if (narg .eq. 7) then
        call getarg(i,arg)
        open(unit=12, file=arg)
    endif
    call show_matrix(int(spin%data), 12)

    ! deallocate spin data.
    deallocate(spin%data)
end program main
