module util
    ! 
    ! Some useful utils. 
    ! 
    ! Author: ph
    ! Email: huipan.hnu@qq.com
    ! Date: 2017.06.20
    ! 
    implicit none
    interface show_matrix
        module procedure show_real_matrix
        module procedure show_int_matrix
    end interface show_matrix
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

    subroutine show_real_matrix(matrix, device)
        ! 
        ! Print matrix as it's shape
        ! 
        !   matrix    [real]        matrix/array to print.
        !   device    [integer]     id of output device.
        ! 
        implicit none
        real, dimension(:,:) :: matrix
        integer :: rows, cols
        integer, optional :: device
        character(len=32) :: fmt
        rows = size(matrix, 1)
        cols = size(matrix, 2)
        write(fmt,"('(',I0,'(',I0,'(TR1,F0.1),/))')") rows, cols
        if (present(device)) then
            write(device,fmt) matrix
        else
            write(*,fmt) matrix
        endif
    end subroutine show_real_matrix

    subroutine show_int_matrix(matrix, device)
        ! 
        ! Print matrix as it's shape
        ! 
        !   matrix    [real]        matrix/array to print.
        !   device    [integer]     id of output device.
        ! 
        implicit none
        integer, dimension(:,:) :: matrix
        integer :: rows, cols
        integer, optional :: device
        character(len=32) :: fmt
        rows = size(matrix, 1)
        cols = size(matrix, 2)
        write(fmt,"('(',I0,'(',I0,'(TR1,I0.1),/))')") rows, cols
        if (present(device)) then
            write(device,fmt) matrix
        else
            write(*,fmt) matrix
        endif
    end subroutine show_int_matrix
end module util