import numpy as np
import pylab as plb
import sys
import os

def main():
    spin_file = None
    img_path = None
    if len(sys.argv) < 2 or len(sys.argv) > 3:
        print ('Usage: ising_plot [spins_file] [save image]')
        return
    if len(sys.argv) > 1:
        spin_file = sys.argv[1]
    if len(sys.argv) > 2:
        img_path = sys.argv[2]
    if spin_file != None:
        if os.path.isfile(spin_file):
            spin = np.loadtxt(os.path.abspath(spin_file))
            plb.imshow(spin)
            plb.set_cmap('gray')
            print(img_path)
            if img_path != None:
                try:
                    plb.imsave(img_path, spin)
                except:
                    print('Error: img save error !')
            plb.show()

if __name__ == '__main__':
    main()
