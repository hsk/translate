- 6 Extensions
	
	We extend λΠ,Σ pat with parametric polymorphism, exceptions and references in this section, attesting to the adaptability and practicality of our proposed approach to supporting the use of dependent types in the presence of realistic programming features.

- 6.1 Parametric polymorphism
	
	We first extend the syntax of λΠ,Σ pat as follows:

		types τ ::= . . . | α
		type schemes σ ::= ∀α~. τ
		contexts Γ ::= · | Γ, xf : σ

	where we use α to range over type variables. A c-type is now of the following form:
	
		∀α. ~ Πφ.P~ ⊃ (τ ⇒ (~τ )δ(~I))

	and the typing rules (ty-var) and (ty-const) are modified as follows:

		Γ(xf) = ∀α. ~ τ φ ` ~τ [type]
		φ; P~; Γ ` xf : τ [α~ 7→ ~τ ]
		(ty-var)
		α~; φ0; P~
		0 ` c(τ ) : (~τ0)δ(~I0) φ ` ~τ [type]
		φ ` Θ : φ0 φ; P~ |= P~
		0[Θ] φ; P~; Γ ` e : τ [α~ 7→ ~τ ][Θ]
		φ; P~ ; Γ ` c(e) : (~τ0[α~ 7→ ~τ ])δ(~I0[Θ])
		(ty-const)

	We write α~; φ0; P~0 ` c(τ ) : (~τ0)δ(~I0) to indicate that the constant c is assigned the c-type ∀α~.Πφ0.P~0 ⊃ (τ ⇒ δ(~I0)), and φ ` ~τ [type] to mean that φ ` τ [type] is derivable for each τ in ~τ , and [α~ 7→ ~τ ] for a substitution that maps α~ = α1, . . . , αn to ~τ = τ1, . . . , τn. We now need the following static subtype rule to deal with type variables:
	
		φ; P~ |= α ≤s
		tp α
		(st-sub-var)

	In addition, the rule (st-sub-base) needs to be modified as follows:

		φ; P~ |= τ1 =s
		tp τ
		0
		1
		· · · φ; P~ |= τm =s
		tp τ
		0
		m
		φ; P~ |= I1
		.= I
		0
		1
		· · · φ; P~ |= In
		.= I
		0
		n
		φ; P~ |= (τ1, . . . , τm)δ(I1, . . . , In) ≤s
		tp (τ
		0
		1
		, . . . , τ
		0
		m)δ(I
		0
		1
		, . . . , I
		0
		n)
		(st-sub-base)

	where for types τ and τ0, τ =s tp τ0 means both τ ≤s tp τ 0 and τ 0 ≤s tp τ hold.

	It is possible to replace τi =s tp τ0 i with τi ≤s tp τ0 i (τ0 i ≤s tp τi) if δ is covariant (contravariant) with respect to its i th type argument.

	However, we do not entertain this possibility in this paper (but do so in implementation).

	----

	The following typing rules (ty-poly) and (ty-let) are introduced for handling let-polymorphism as is supported in ML:

		φ; P~ ; Γ ` e : τ α~ # Γ
		φ; P~; Γ ` e : ∀α. ~ τ
		(ty-poly)
		φ; P~ ; Γ ` e1 : σ1 φ; P~ ; Γ, x : σ1 ` e2 : σ2
		φ; P~; Γ ` let x = e1 in e2 end : σ2
		(ty-let)

	Obviously, we need to associate with the rule (ty-poly) a side condition that requires no free occurrences of α~ in Γ. This condition is written as α~ # Γ.

	----

	As usual, the type soundness of this extension is established by the subject reduction theorem and the progress theorem stated as follows:

	- Theorem 6.1 (Subject Reduction)

		Assume that D :: ∅; ∅; ∅ ` e1 : σ is derivable and e1 ,→ev e2 holds. Then ∅; ∅; ∅ ` e2 : σ is also derivable.

	- Theorem 6.2 (Progress)

	Assume that ∅; ∅; ∅ ` e1 : σ is derivable. Then there are the following possibilities:

		c(raise(v)) ,→ev raise(v)
		hraise(v), ei ,→ev raise(v)
		hv0, raise(v)i ,→ev raise(v)
		(raise(v))(e) ,→ev raise(v)
		v0(raise(v)) ,→ev raise(v)
		case raise(v) of ms ,→ev raise(v)
		let x = raise(v) in e end ,→ev raise(v)
		⊃
		−(raise(v)) ,→ev raise(v)
		Π
		−(raise(v)) ,→ev raise(v)
		let ∧(x) = raise(v) in e end ,→ev raise(v)
		let Σ(x) = raise(v) in e end ,→ev raise(v)
		try raise(v) with ms ,→ev
		
		
		
		e[θ] if match(v, p) ⇒ θ holds
		for some p ⇒ e in ms;
		raise(v) otherwise.

		Fig. 27. Additional forms of redexes and their reducts

	- e1 is a value, or
	- e1 is in M-form, or
	- e1 is in U-form, or
	- e1 ,→ev e2 holds for some expression e2.

	We omit the proofs for these two theorems, which are essentially the same as the ones for Theorem 4.11 and Theorem 4.12.

- 6.2 Exceptions

	We further extend λΠ,Σ pat with exceptions.

	First, we introduce the following additional syntax, where exn is the type for values representing exceptions.

		types τ ::= . . . | exn
		expressions e ::= . . . | raise(e) | try e with ms
		answers ans ::= v | raise(v)

	An answer of the form raise(v) is called a raised exception, where v is the exception being raised.

	We also introduce in Figure 27 some new forms of ev-redexes and their reducts, which are needed for propagating a raised exception to the top level.

	In addition, we introduce a new form of evaluation context to allow a raised exception to be captured (potentially):

		evaluation contexts E ::= . . . | try E with ms

	The following typing rules are needed for handling the newly added language constructs:

		φ; P~; Γ ` e : exn
		φ; P~; Γ ` raise(e) : σ
		(ty-raise)
		φ; P~ ; Γ ` e : τ φ; P~; Γ ` ms : exn → τ
		φ; P~ ; Γ ` try e with ms : τ
		(ty-try)

	Again, the type soundness of this extension rests upon the following two theorems:

	- Theorem 6.3 (Subject Reduction)

		Assume D :: ∅; ∅; ∅ ` e1 : σ e1 ,→ev e2. Then ∅; ∅; ∅ ` e2 : σ is also derivable.

	- Theorem 6.4 (Progress)

		Assume that ∅; ∅; ∅ ` e1 : σ is derivable.

		Then there are the following possibilities:

		- e1 is a value, or
		- e1 is a raised exception, or
		- e1 is in M-form, or
		- e1 is in U-form, or
		- e1 ,→ev e2 holds for some expression e2.

		We omit the proofs for these two theorems, which are essentially the same as the ones for Theorem 4.11 and Theorem 4.12.
		
		----

		Assume the existence of two exception constants Match and Undefined that are assigned the c-type () ⇒ exn.

		We can then introduce the following evaluation rules for handling expressions in M-form or U-form:
		case v of ms ,→ev raise(Match) if v matches none of the patterns in ms.
		cf(v) ,→ev raise(Undefined) if cf(v) is undefined.

		Then the progress theorem can be stated as follows:

	- Theorem 6.5 (Progress)

		Assume that ∅; ∅; ∅ ` e1 : σ is derivable. Then there are the following possibilities:

		- e1 is a value, or
		- e1 is a raised exception, or
		- e1 ,→ev e2 holds for some expression e2.

		So we can now claim that the evaluation of a well-typed program either terminates with an answer, that is, a value or a raised exception, or goes on forever.
	
- 6.3 References

	In this section, we add into λΠ,Σ pat another effectful programming feature: references.

	We first introduce a unary type constructor ref that takes a type τ to form a reference type (τ )ref.

	We need the following static subtype rule for dealing with the type constructor ref:

		φ; P~ |= τ1 ≤s
		tp τ2 φ; P~ |= τ2 ≤s
		tp τ1
		φ; P~ |= (τ1)ref ≤s
		tp (τ2)ref
		(st-sub-ref)

	which takes into account that ref is nonvariant on its type argument.

	We also assume the existence of the following predefined functions ref, ! (prefix) and := (infix) with the assigned c-types:

		ref : ∀α.(α) ⇒ (α)ref
		! : ∀α.((α)ref) ⇒ α
		:= : ∀α.((α)ref, α) ⇒

	We use l to range over an infinite set of reference constants l1, l2, . . ., which one may simply assume are represented as natural numbers.

	We use M and µ for stores and store types, respectively, which are defined below as finite mappings:

		stores M ::= [] | M[l 7→ v]
		store types µ ::= [] | µ[l 7→ τ ]

	Note that we do allow type variables to occur in a store type.

	In other words, for each l ∈ dom(µ), µ(l) may contain free type variables.

	----

	We say that a store M0 extends another store M if M(l) = M0 (l) for every l ∈ dom(M) ⊆ dom(M0).

	Similarly, we say that a store type µ0 extends another store type µ if µ(l) = µ0 (l) for every l ∈ dom(µ) ⊆ dom(µ0).

	- Definition 6.6 (Stateful Reduction)

		The stateful reduction relation (M1, e1) ,→ev/st (M2, e2) is defined as follows:

		- If e1 ,→ev e2 holds, then we have (M, e1) ,→ev/st (M, e2).

		- If e1 = E[ref(v)], then we have (M, e1) ,→ev/st (M[l 7→ v], E[hi]) for any reference constant l 6∈ dom(M).

			So nondeterminism appears to be involved in this case.

			This form of nondeterminism can be eliminated if we equate (M, e) and (M0, e0) whenever one can be obtained from the other by properly renaming the reference constants. The precise definition of such a renaming algorithm is omitted as it is not needed in this paper.

		- If e1 = E[!l] and M(l) = v, then we have (M, e1) ,→ev/st (M, E[v]).

		- If e1 = E[l := v] and l ∈ dom(M), then we have (M, e1) ,→ev/st (M0, E[hi]),
		where M0
		is a store such that dom(M0
		) = dom(M) and M0
		(l) = v and
		M0
		(l
		0
		) = M(l
		0
		) for every l
		0
		in dom(M) that is not l.
		As usual, we use ,→∗
		ev/st for the reflexive and transitive closure of ,→ev/st.
		Given an answer ans, we say that ans is observable if ans = v or ans = raise(v)
		for some observable value v.

	- Definition 6.7

		Given two expressions e1 and e2 in λpat extended with polymorphism, exceptions and references, we say that e1 ≤dyn e2 holds if for any store M1 and any

		context G, either (M1, G[e2]) ,→∗
		ev/st (M2, Error) holds for some store M2, or
		(M1, G[e1]) ,→∗
		ev/st (M2, ans∗
		) if and only if (M1, G[e2]) ,→∗
		ev/st (M2, ans∗
		), where
		M2 ranges over stores and ans∗
		ranges over the set of observable answers.

		The definition of the dynamic subtype relation ≤d tp (Definition 4.15) can be modified according to the above definition of ≤dyn.

		In particular, we can readily verify that Lemma 2.14 still holds (as the generate reduction relation ,→g is still defined in the same manner).

		We now outline as follows an approach to typing references, which is largely based upon the one presented in (Harper, 1994).

		A typing judgment is now of the form φ; P~; Γ `µ e : σ, and all the previous typing rules need to be modified accordingly.

		Also, we introduce the following typing rule for assigning types to reference constants:
		
			µ(l) = τ
			φ; P~ ; Γ `µ l : (τ )ref
			(ty-ref)

		We say that an expression e is value-equivalent if |e| ≤dyn v holds for some value v.

		A form of value restriction is imposed by the following rules:

			φ; P~ , P; Γ `µ e : τ e is value-equivalent
			φ; P~; Γ `µ⊃+(e) : P ⊃ τ
			(ty-⊃-intro)
			φ, a : s; P~; Γ `µ e : τ e is value-equivalent
			φ; P~ ; Γ `µ Π+(e) : Πa:s. τ
			(ty-Π-intro)
			φ; P~ ; Γ `µ e : τ α~ # Γ α~ # µ e is value-equivalent
			φ; P~; Γ `µ e : ∀α~. τ
			(ty-poly)

		In the rule (ty-poly), α~ # µ means that there is no free occurrence of α in µ(l) for any α ∈ α~, where l ranges over dom(µ).

		Also, we need to extend the definition of evaluation contexts as follows:

			E ::= . . . | ⊃+(E) | Π
			+(E)

		As an example, when applying the rule (ty-Π-intro) to an expression, we need to verify that the expression must be value-equivalent.

		This is slightly different from the usual form of value restriction(Wright, 1995) imposed, for instance, in ML.

		The minor change is needed since the elaboration of a value may not necessarily be a value.

		For instance, this may happen if the rule (elab-dn-up) is applied.

		By Lemma 5.2 and Lemma 2.14, we know that the elaboration of a value is always value-equivalent.

		Given a store M and a store type µ, we write M : µ to mean that the store M can be assigned the store type µ, which is formally defined as follows:

			∅; ∅; ∅ `µ M(l) : µ(l) for every l ∈ dom(M) = dom(µ)
			M : µ
			(ty-store)

		Again, the type soundness of this extension rests upon the following two theorems:

	- Theorem 6.8 (Subject Reduction)

		Assume M1 : µ1 holds and ∅; ∅; ∅ `µ1 e1 : σ is derivable. If (M1, e1) ,→ev/st (M2, e2) holds, then there exists a store typing µ2 that extends µ1 such that M2 : µ2 holds and ∅; ∅; ∅ `µ2 e2 : σ is derivable.

	- Theorem 6.9 (Progress)

		Assume that M : µ holds and ∅; ∅; ∅ `µ e : σ is derivable.

		Then there are the following possibilities:

		- e is a value v, or
		- e is a raised exception raise(v), or
		- (M, e) ,→ev/st (M0, e0) holds for some store M0 and expression e0 such that M0 extends M.

		The proofs for these two theorems are essentially the same as the ones for Theorem 4.11 and Theorem 4.12, and some related details can also be found in (Harper, 1994).

		In Appendix C, we provide a proof sketch for Theorem 6.8 that clearly demonstrates some involvement of value restriction.
