program main
    ! 
    ! Execute program and count it's running time.
    ! 
    ! Usage: runtime [command]
    ! 
    ! Author: ph
    ! Email: huipan.hnu@qq.com
    ! Date: 2017.06.20
    ! 
    implicit none
    character(len=256) :: cmd_line
    character(len=32) :: args(32)
    integer :: i, narg, time(0:1)
    narg = iargc()
    do i = 1, narg
        call getarg(i,args(i))
    end do
    write(cmd_line,"(TR1,32A)") args(1:narg)
    call system_clock(time(0))
    call system(cmd_line)
    call system_clock(time(1))
    write(*,"('[Finished in ',(F0.3),'s]')") real(time(1)-time(0))/1000
end program main
