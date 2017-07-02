module ising
    ! 
    ! Ising 2d simulation module.
    ! 
    ! Author: ph
    ! Email: huipan.hnu@qq.com
    ! Date: 2017.07.02
    ! 
    use util
    implicit none
    type :: spins
        ! spins type for storage of spin data
        integer :: rows, cols
        real    :: temp, magn
        integer(kind=1), pointer :: data(:, :)
    end type spins
contains
    subroutine init_spins(spin, rows, cols, temp, magn)
        ! 
        ! Init spins according to given spin and other pramaters.
        ! 
        !   spin    [type(spins)]     spin data storage of ising system.
        !   rows    [integer]         2d square ising system rows.
        !   cols    [integer]         2d square ising system cols.
        !   temp    [real]            temperature of ising system.
        !   magn    [real]            magnet filed of ising system.
        !   
        implicit none
        integer         ::  rows, cols
        real            ::  temp, magn, rdata(rows, cols)
        type(spins)     ::  spin
        integer         ::  row , col
        
        call init_random_seed()
        call random_number(rdata)
        allocate(spin%data(rows, cols))
        where(rdata < 0.5)
            spin%data = -1
        elsewhere
            spin%data = 1
        end where
        spin%rows = rows
        spin%cols = cols
        spin%temp = temp
        spin%magn = magn
    end subroutine init_spins

    subroutine ising_simulate(spin, steps, times, handle)
        ! 
        ! Ising module simulation based on Monte-Carl method.
        ! 
        !   spin    [type(spins)]   spin data storage of ising system.
        !   steps   [integer]       steps of inner loop, also sampling steps.
        !   times   [integer]       outter loop iteration, also sampling times.
        !   handle  [function]      supply update function for Monte-Carl method.
        ! 
        implicit none
        type(spins)         :: spin
        integer(kind=4)     :: steps, times, step, time
        integer             :: row, col
        real                :: position(2)
        external            :: handle

        do time = 1, times
            do step = 1, steps
                call random_number(position)
                row = int(position(1)*spin%rows+1)
                col = int(position(2)*spin%cols+1)
                call handle(spin, step, time, row, col)
            end do
        end do
    end subroutine ising_simulate
end module ising