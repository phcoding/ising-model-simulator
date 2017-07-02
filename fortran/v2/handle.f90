module handle
    use ising
    implicit none
    real, parameter :: esp = 0.000001, J1 = 1
contains
    real function get_delta_energy(spin, row, col) result(delta_energy)
        implicit none
        integer, intent(in)     :: row, col
        type(spins), intent(in) :: spin
        integer(kind=1)         :: sr, sl, st, sb

        if (row < 2) then
            st = spin%data(spin%rows, col)
            sb = spin%data(row + 1  , col)
        else if(row > spin%rows-1) then
            st = spin%data(row - 1  , col)
            sb = spin%data(1        , col)
        else
            st = spin%data(row - 1  , col)
            sb = spin%data(row + 1  , col)
        end if

        if (col < 2) then
            sl = spin%data(row, spin%cols)
            sr = spin%data(row  , col + 1)
        else if(col > spin%cols-1) then
            sl = spin%data(row  , col - 1)
            sr = spin%data(row        , 1)
        else
            sl = spin%data(row  , col - 1)
            sr = spin%data(row  , col + 1)
        end if
        delta_energy = 2*spin%data(row, col)*(J1*(sl+sr+st+sb)+spin%magn)
    end function get_delta_energy

    real function get_total_energy(spin) result(total_energy)
        implicit none
        type(spins)     :: spin
        integer         :: row, col
        integer(kind=1) :: sr, sb
        
        total_energy = 0
        do col = 1, spin%cols
            do row = 1, spin%rows
                if (row > spin%rows-1) then
                    sb = spin%data(1, col)
                else
                    sb = spin%data(row+1, col)
                end if
                if (col > spin%cols-1) then
                    sr = spin%data(row, 1)
                else
                    sr = spin%data(row, col+1)
                end if
                total_energy = total_energy - spin%data(row, col)*(J1*(sr+sb)+spin%magn)
            end do
        end do
    end function get_total_energy

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
        value_average = value/(spin%rows*spin%cols)
    end function ising_average

    ! update function to update ising system.
    subroutine update(spin, step, time, row, col)
        implicit none
        integer(kind=4) :: step, time
        integer         :: row, col
        type(spins)     :: spin
        real            :: delta_energy, u

        call random_number(u)
        delta_energy = get_delta_energy(spin, row, col)
        if (delta_energy < esp .or. exp(-delta_energy/spin%temp) > u) then
            spin%data(row, col) = -spin%data(row, col)
        endif

        if (step .eq. 1) then
            write(*,"(T4,I0,T12,F0.6)") time, ising_average(spin,get_total_energy(spin))
        endif
    end subroutine update
end module handle
