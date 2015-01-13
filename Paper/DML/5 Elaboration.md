- 5 Elaboration

	We have so far presented an explicitly typed language λΠ,Σ pat .
	This presentation has a serious drawback from the point of view of a programmer:
	One may quickly be overwhelmed with the need for writing types when programming in such a setting.
	It then becomes apparent that it is necessary to provide an external language DML0 together with a mapping from DML0 to the internal language λΠ,Σ pat , and we call such a mapping elaboration.
	We may also use the phrase type-checking loosely to mean elaboration, sometimes.

	----

	We are to introduce a set of rules to perform elaboration.
	The elaboration process itself is nondeterministic.
	Nonetheless, we can guarantee based on Theorem 5.3 that if e in DML0 can be elaborated into e in λΠ,Σ pat , then e and e are operationally equivalent.
	In other words, elaboration cannot alter the dynamic semantics of a program.
	This is what we call the soundness of elaboration, which is considered a major contribution of the paper.
	We are to perform elaboration with bi-directional strategy that casually resembles the one adopted by Pierce and Turner in their study on local type inference (Pierce & Turner, 1998), where the primary focus is on the interaction between polymorphism and subtyping.

	----

	We present the syntax for DML0 in Figure 20, which is rather similar to that of λΠ,Σ pat .
	In general, it should not be difficult to relate the concrete syntax used in our program examples to the formal syntax of DML0.
	We now briefly explain as to how some concrete syntax can be used to provide type annotations for functions.
	We essentially support two forms of type annotations for functions, both of which are given below:
	
		fun succ1 (x) = x + 1
		withtype {a:int | a >= 0} int (a) -> int (a+1)

		fun succ2 {a:int | a >= 0} (x: int(a)): int(a+1) = x + 1

	The first form of annotation allows the programmer to easily read out the type of the annotated function while the second form makes it more convenient to handle a case where the body of a function needs to access some bound type index variables in the type annotation.
	The concrete syntax for the definition of succ1 translates into the following formal syntax,

		fix f : τ. λa : sˆ. lamx : int(a).(x + 1 : int(a + 1))

	where sˆ = {a : int | a ≥ 0}, and so does the concrete syntax for the definition of succ2.
	As an example, both forms of annotation are involved in the following program, which computes the length of a given list:

		fun length {n:nat} (xs: ’a list n): int n =
			let // this is a tail-recursive implementation
				fun aux xs j = case xs of
				| nil => j
				| cons (_, xs) => aux xs (j+1)
				withtype {i:nat, j:nat | i+j=n} ’a list i -> int j -> int n
			in
				aux xs 0
			end

	Note that the type index variable n is used in the type annotation for the inner auxiliary function aux .

	----

	In the following presentation, we may use ⊃ + n (·) for ⊃ +(...(⊃ +(·))...), where

		φ; P~ |= I1.= I'1 ··· φ; P~ |= In.= I'n
		---------------------------------------------------------------------(dy-sub-base)
		φ;P~ |- [] : δ(I1, ..., In) ≤ δ(I'1, ..., I'n)

		---------------------------------------------------------------------(dy-sub-unit)
		φ; P~ |- [] : 1 ≤ 1

		φ; P~ ; x1 : τ1, x2 : τ2 |- hx1, x2i ↓ τ ⇒ e
		---------------------------------------------------------------------(dy-sub-prod)
		φ;P~ |- let hx1, x2i = [] in e end : τ1 ∗ τ2 ≤ τ

		φ;P~ ; x : τ, x1 : τ1 |- x(x1) ↓ τ2 ⇒ e
		---------------------------------------------------------------------(dy-sub-fun)
		φ; P~ |- let x = [] in lamx1. e end : τ ≤ τ1 → τ2

		sˆ = {a : s | P1, ..., Pn} φ, a : s; P~ , P1, ..., Pn |- E : τ ≤ τ'
		---------------------------------------------------------------------(dy-sub-Π-r)
		φ; P~ |- Π+(⊃+ n (E)) : τ ≤ Πa:sˆ. τ'

		sˆ = {a : s | P1, ..., Pn} φ, a : s; P~ , P1, ..., Pn |- E : τ ≤ τ'
		---------------------------------------------------------------------(dy-sub-Σ-l)
		φ; P~ |- let Σ(∧n(x)) = [] in E[x] end : Σa:s. ˆ τ ≤ τ'

		sˆ = {a : s | P1, ..., Pn} φ |- I : sˆ φ; P~ |- E : τ [a |→ I] ≤ τ'
		---------------------------------------------------------------------(dy-sub-Π-l)
		φ; P~ |- E[⊃− n (Π−([]))] : Πa:sˆ. τ ≤ τ'

		sˆ = {a : s | P1, ..., Pn} φ |- I : sˆ φ; P~ |- E : τ ≤ τ' [a |→ I]
		---------------------------------------------------------------------(dy-sub-Σ-r)
		φ; P~ |- Σ(∧n(E)) : τ ≤ Σa:sˆ. τ'

	Fig. 21. The dynamic subtype rules in λΠ,Σ pat.

	there are n occurrences of ⊃ +, and ∧n(·) for ∧(...(∧(·))...), where there are n occurrences of ∧, and let Σ(∧0(x)) = e1 in e2 end for let Σ(x) = e1 in e2 end, and let Σ(∧n+1(x)) = e1 in e2 end for the following expression: let Σ(∧n(x)) = (let ∧ (x) = e1 in x end) in e2 end, where n ranges over natural numbers.

	- Proposition 5.1

		We have |let x = e1 in e2 end| ≤dyn |let Σ(∧n(x)) = e1 in e2 end|.

		- Proof

			This immediately follows from Lemma 2.14 and the observation that

				|let Σ(∧n(x)) = e1 in e2 end| ,→∗g |let x = e1 in e2 end|

			holds. □
