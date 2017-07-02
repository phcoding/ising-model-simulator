module util
    ! 
    ! Some useful utils. 
    ! 
    ! Author: ph
    ! Email: huipan.hnu@qq.com
    ! Date: 2017.06.20
    ! 
    implicit none
contains
    subroutine show_matrix(matrix, device)
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
    end subroutine show_matrix
end module util
