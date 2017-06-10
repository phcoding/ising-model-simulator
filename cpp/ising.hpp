#ifndef __ISING_H__
#define __ISING_H__

extern double calculate_energy(int *spin[], int L, double H);
extern double ising2(double H, double T, int L, int N);

#endif