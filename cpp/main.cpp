#include <iostream>
#include "ising.hpp"

using namespace std;

int main(int argc, const char * argv[])
{
	double H,T;
	int N,L;
	cout << "H: ";
	cin >> H;
	cout << "T: ";
	cin >> T;
	cout << "L: ";
	cin >> L;
	cout << "N: ";
	cin >> N;
	cout << ising2(H, T, L, N);
	return 0;
}