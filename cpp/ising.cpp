#include "ising.hpp"
#include <time.h>
#include <math.h>
#include <stdlib.h>
#include <iostream>

typedef unsigned int uint;

double calculate_energy(int * spin[], int L, double H)
{
	double energy = 0;
	int s_nr, s_nb;
	for (int i = 0; i < L; i++)
	{
		for (int j = 0; j < L; j++)
		{
			s_nr = j < L - 1 ? spin[i][j + 1] : 0;
			s_nb = i < L - 1 ? spin[i + 1][j] : 0;
			energy += -spin[i][j] * (s_nr + s_nb + H);
		}
	}
	return energy;
}

double ising2(double H, double T, int L, int N)
{
	int x, y, s_nr, s_nb, s_nt, s_nl;
	int **spin = new int*[L];
	double delta_energy;
	srand((uint)time(NULL));
	for (int i = 0; i < L; i++)
	{
		spin[i] = new int[L];
		for (int j = 0; j < L; j++)
		{
			spin[i][j] = (rand()%2)*2-1;
		}
	}
	for (int i = 0; i < N; i++)
	{
		for (int j = 0; j < 1e4; j++)
		{
			
			x = rand() % L;	//row
			y = rand() % L;	//col
			s_nr = y < L - 1 ? spin[x][y + 1] : 0;
			s_nl = y > 0 ? spin[x][y - 1] : 0;
			s_nb = x < L - 1 ? spin[x + 1][y] : 0;
			s_nt = x > 0 ? spin[x - 1][y] : 0;
			delta_energy = 2 * spin[x][y] * (s_nb + s_nl + s_nr + s_nt + H);
			if (delta_energy < 0 || (double)(rand() % 100) / 100 < exp(-delta_energy / T)) {
				spin[x][y] = -spin[x][y];
			}
		}
		//std::cout << calculate_energy(spin, L, H) << std::endl;
	}
	return calculate_energy(spin, L, H);
}