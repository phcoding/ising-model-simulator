#!/usr/bin/env python3

import numpy as np
import pylab as plb
import os
import argparse

def main():
    """
    Draw spin file to image and display or save to image file.

    Usage: `spin_plot  [-l] [fdata] [-o fsave]`
    Params:
        --fdata     data file from ising simulating.
        --fsave     image file to save in.
    """
    parser = argparse.ArgumentParser()
    parser.add_argument("-l", "--log", help="plot log data.", action="store_true")
    parser.add_argument("fdata", help="data file from ising simulation.")
    parser.add_argument("-o", "--fsave", help="image file to save in.")
    args = parser.parse_args()
    if not os.path.isfile(args.fdata):
        print('Error: data file not exist !')
    else:
        # load data file.
        data = np.loadtxt(args.fdata)

        # plot data to image.
        if args.log:
            plb.plot(data[:,0], data[:,1])
        else:
            plb.imshow(data)
            plb.set_cmap('gray')

        # save image file
        if args.fsave is not None:
            if args.log:
                plb.savefig(args.fsave)
            else:
                plb.imsave(args.fsave, data)
        else:
            plb.show()

if __name__ == '__main__':
    main()
