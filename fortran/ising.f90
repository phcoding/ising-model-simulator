module ising
    ! 
    ! Ising 2d simulation module.
    ! 
    ! Author: ph
    ! Email: huipan.hnu@qq.com
    ! Date: 2017.06.20
    ! 
    implicit none
    real, parameter :: eps = 1e-6
    type :: spins
        ! spins type for storage of spin data
        integer(kind=1), allocatable :: data(:,:)
        real :: temp, magn
    end type spins
contains
    subroutine init_random_seed()
        ! 
        ! init random seed
        ! 
        implicit none
        integer :: i, n, clock
        integer, dimension(:), allocatable :: seed
        call random_seed(size=n)
        allocate(seed(n))
        call system_clock(count=clock)
        seed = clock+37*(/(i-1,i=1,n)/)
        call random_seed(put=seed)
        deallocate(seed)
    end subroutine init_random_seed

    subroutine init_spins(spin, size, temp, magn)
        ! 
        ! Init spins according to given spin and other pramaters.
        ! 
        !   spin    [type(spins)]     spin data storage of ising system.
        !   size    [integer]         2d square ising system side.
        !   temp    [real]            temperature of ising system.
        !   magn    [real]            magnet filed of ising system.
        !   
        implicit none
        type(spins) :: spin
        integer :: i, j, size
        real :: temp, magn, data(size, size)
        call init_random_seed()
        call random_number(data)
        where(data<0.5)
            data = -1
        elsewhere
            data = 1
        end where
        allocate(spin%data(size, size))
        spin%data = int(data, 1)
        spin%temp = temp
        spin%magn = magn
    end subroutine init_spins

    real function get_delta_energy(spin, r, c) result(delta_energy)
        ! 
        ! Get delta energy of spin the site on (r, c)
        ! 
        !   spin    [type(spins)]   spin data storage of ising system.
        !   r       [integer]       rows of site point.
        !   c       [integer]       cols of site point.  
        !   return  [real]          return delta energy after spined.
        ! 
        implicit none
        type(spins), intent(in) :: spin
        integer(kind=1) :: s_t, s_b, s_r, s_l
        integer :: r, c, s(2)
        s = [size(spin%data, 1), size(spin%data, 2)]
        
        if(r > s(1)-1) then
            s_t = spin%data(r-1, c)
            s_b = spin%data(1, c)
        else if(r < 2) then
            s_t = spin%data(s(1), c)
            s_b = spin%data(r+1, c)
        else
            s_t = spin%data(r-1, c)
            s_b = spin%data(r+1, c)
        end if

        if(c > s(2)-1) then
            s_l = spin%data(r, c-1)
            s_r = spin%data(r, 1)
        else if(c < 2) then
            s_l = spin%data(r, s(2))
            s_r = spin%data(r, c+1)
        else
            s_l = spin%data(r, c-1)
            s_r = spin%data(r, c+1)
        end if
        delta_energy = 2*spin%data(r,c)*(s_l+s_r+s_t+s_b+spin%magn)
    end function get_delta_energy

    real function get_total_energy(spin) result(total_energy)
        ! 
        ! Get total energy of ising system.
        ! 
        !   spin    [type(spins)]   spin data storage of ising system.
        !   return  [real]          total energy of ising system.
        ! 
        implicit none
        type(spins), intent(in) :: spin
        integer(kind=1) :: s_r, s_b
        integer :: r, c, s(2)
        s = [size(spin%data, 1), size(spin%data, 2)]
        total_energy = 0
        do c = 1, s(2)
            do r = 1, s(1)
                if(r>s(1)-1) then
                    s_b = spin%data(1, c)
                else
                    s_b = spin%data(r, c)
                end if
                if(c>s(2)-1) then
                    s_r = spin%data(r, 1)
                else
                    s_r = spin%data(r, c)
                end if
                total_energy = total_energy - spin%data(r, c)*(s_r+s_b+spin%magn)
            end do
        end do
    end function get_total_energy

    integer function get_total_moment(spin) result(total_moment)
        ! 
        ! Get total magnet moment of ising system.
        ! 
        !   spin    [type(spins)]   spin data storage of ising system.
        !   return  [real]          total magnet moment of ising system.
        ! 
        implicit none
        type(spins), intent(in) :: spin
        total_moment = sum(spin%data)
    end function get_total_moment

    real function ising_average(spin, value) result(value_average)
        ! 
        ! Calculate average value of ising quantity by given value.
        ! 
        !   spin    [type(spins)]   spin data storage of ising system.
        !   value   [real]          value of ising quantity.
        !   return  [real]          average value of ising quantity.
        ! 
        implicit none
        real :: value
        type(spins) :: spin
        value_average = value/(size(spin%data,1)*size(spin%data,2))
    end function ising_average

    subroutine ising_simulate(spin, steps, times)
        ! 
        ! Ising module simulation based on Monte-Carl method.
        ! 
        !   spin    [type(spins)]   spin data storage of ising system.
        !   steps   [integer]       steps of inner loop, also sampling steps.
        !   times   [integer]       outter loop iteration, also sampling times.
        ! 
        implicit none
        type(spins) :: spin
        real :: delta_energy, u
        integer :: i, j, steps, times, r, c, s(2)
        s = [size(spin%data,1),size(spin%data,2)]
        call init_random_seed()
        write(*,"('Start simulating: ',I0)") times
        write(*,"(T4,'Time',T12,'Energy')")
        do i = 1, times
            do j = 1, steps
                r = int(rand()*s(1)) + 1
                c = int(rand()*s(2)) + 1
                delta_energy = get_delta_energy(spin, r, c)
                call random_number(u)
                if(delta_energy < eps .or. u < exp(-delta_energy/spin%temp)) then
                    spin%data(r, c) = -spin%data(r, c)
                end if
            end do
            write(*,"(T4,I0,T12,F0.6)") i, ising_average(spin,get_total_energy((spin)))
        end do
        write(*,"('Simulating finished !')")
    end subroutine ising_simulate
end module ising
