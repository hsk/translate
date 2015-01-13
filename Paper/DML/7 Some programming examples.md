- 7 Some programming examples

	We have finished prototyping a language Dependent ML (DML), which essentially extends ML with a form of dependent types in which type index terms are drawn from the type index languages Lint and Lalg presented in Section 3.3.2 and Section 3.3.1, respectively.

	At this moment, DML has already become a part of ATS, a programming language with a type system rooted in the framework Applied Type System (Xi, 2004).

	The current implementation of ATS is available on-line (Xi, 2005), which includes a type-checker and a compiler (from ATS to C) and a substantial library (containing more than 25K lines of code written in ATS itself).

	When handling integer constraints, we reject nonlinear ones outrightly rather than postpone them as hard constraints (Michaylov, 1992), which is planned for future work.

	This decision of rejecting nonlinear integer constraints may seem ad hoc, and it can be too restrictive, sometimes, in a situation where nonlinear constraints (e.g., ∀n : int. n ∗ n ≥ 0) need to be dealt with.

	To address this issue, an approach to combining programming with theorem proving has been proposed recently (Chen & Xi, 2005a).

	If the constraints are linear, we negate them and test for unsatisfiability.

	For instance, the following is a sample constraint generated when an implementation　of binary search on arrays is type-checked:

		φ; P~ |= l + (h − l)/2 + 1 ≤ sz
		where
		φ = h : int, l : int, sz : int
		P~ = l ≥ 0, sz ≥ 0, 0 ≤ h + 1, h + 1 ≤ sz, 0 ≤ l, l ≤ sz, h ≥ l

	The employed technique for solving linear constraints is mainly based on the FourierMotzkin variable elimination approach (Dantzig & Eaves, 1973), but there are many other practical methods available for this purpose such as the SUP-INF method (Shostak, 1977) and the well-known simplex method.

	We have chosen FourierMotzkin’s method mainly for its simplicity.

	We now briefly explain this method.

	We use x for integer variables, a for integers, and l for linear expressions.

	Given a set of inequalities S, we would like to show that S is unsatisfiable.

	We fix a variable x and transform all the linear inequalities into one of the two forms: l ≤ ax and ax ≤ l, where a ≥ 0 is assumed.

	For every pair l1 ≤ a1x and a2x ≤ l2, where a1, a2 > 0, we introduce a new inequality a2l1 ≤ a1l2 into S, and then remove from S all the inequalities involving x.

	Clearly, this is a sound but incomplete procedure.

	If x were a real variable, then the procedure would also be complete.

	In order to handle modulo arithmetic, we also perform another operation to rule out non-integer solutions: we transform an inequality of form

		a1x1 + · · · + anxn ≤ a

	Recently,, we have also implemented a constraint solver based the simplex method.

	Our experience indicates that Fourier-Motzkin’s method is almost always superior to the the simplex method due to the nature of the constraints encountered in practice.

		into a1x1 + · · · + anxn ≤ a0,
		where a
		0
		is the largest integer such that a
		0 ≤ a and the greatest common divisor
		of a1, . . . , an divides a
		0.

	The method can be extended to become both sound and complete while remaining practical (see, for example, (Pugh & Wonnacott, 1992; Pugh & Wonnacott, 1994)).

	In DML, we do allow patterns in a matching clause sequence to be overlapping, and sequential pattern matching is performed at run-time.

	This design can lead to some complications in type-checking, which will be mentioned in Section 7.2.

	Please refer to (Xi, 2003) for more details on this issue.
	
	We now present some programing examples taken from a prototype implementation of DML, giving the reader some concrete feel as to how dependent types can actually be used to capture programming invariants in practice.
