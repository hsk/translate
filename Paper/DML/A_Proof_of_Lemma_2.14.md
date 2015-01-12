- A Proof of Lemma 2.14

	The key step in the proof of Lemma 2.14 is to show that if e ,→∗
	g
	e
	0 and e ,→ev e1
	hold then there exists e
	0
	1
	such that both e1 ,→∗
	g
	e
	0
	1
	and e
	0
	,→∗
	ev e
	0
	1 hold. We are to
	employ a notion of parallel reduction (Takahashi, 1995) to complete this key step.
	Definition A.1 (Parallel general reduction)
	Given two expressions e and e
	0
	in λpat, we say that e g-reduces to e
	0
	in parallel if
	e ,→ g e
	0
	can be derived according to the rules in Figure A 1.
	Note that the symbol ,→ g is overloaded to also mean parallel reduction on evaluation
	contexts, matching clause sequences and substitutions.
	Intuitively, e ,→ g e
	0 means that e
	0
	can be obtained from reducing (many) gredexes
	in e simultaneously. Clearly, if e g-reduces to e
	0
	, that is, e ,→g e
	0 holds,
	then e g-reduces to e
	0
	in parallel, that is e ,→ g e
	0 holds.
	Proposition A.2
	Assume that e and e
	0 are two expressions in λpat such that e ,→ g e
	0 holds.
	1. If e is an observable value, then e = e
	0
	.
	2. If e is in V-form, then so is e
	0
	.
	3. If e is in M-form, then so is e
	0
	.
	4. If e is in U-form, then so is e
	0
	.
	Proof
	Straightforward.
	Note that if e is in E-form and e ,→ g e
	0 holds, then e
	0
	is not necessarily in E-form.
	For instance, assume e = hfst(lam x. x), snd(lam x. x)i(hi). Then e is in E-form.
	Note that e ,→ g e
	0 holds for e
	0 = (lam x. x)(hi), which is not in E-form (e
	0
	is actually
	in R-form).
	The essence of parallel general reduction is captured in the following proposition.
	Proposition A.3
	1. Assume E ,→ g E0 and e ,→ g e
	0
	for some evaluation contexts E, E0 and expressions
	e, e
	0
	in λpat. Then we have E[e] ,→ g E0
	[e
	0
	].
	2. Assume e ,→ g e
	0 and θ ,→ g θ
	0
	for some expressions e, e
	0 and substitutions θ, θ
	0
	in λpat. Then we have e[θ] ,→ g e
	0
	[θ
	0
	].
	Proof
	(Sketch) By structural induction.
	In the proof of Proposition A.3, it needs to be verified that for each evaluation
	context E and θ, E[θ], the evaluation context obtained from applying θ to E, is
	also an evaluation context. This follows from the fact that θ maps each lam-variable
	x (treated as a value) in its domain to a value.
	Lemma A.4
	Assume that match(v, p) ⇒ θ is derivable in λpat, where v, p, θ are a value, a
	pattern and a substitution, respectively. If v ,→ g v
	0 holds for some value v
	0
	, then
	we can derive match(v
	0
	, p) ⇒ θ
	0
	for some θ
	0
	such that θ ,→ g θ
	0 holds.
	Proof
	(Sketch) By structural induction on the derivation of match(v, p) ⇒ θ.
	The following lemma is the key step to proving Lemma 2.14. Given two expressions
	e, e
	0
	, we write e ,→0/1
	ev e
	0
	to mean that e = e
	0 or e ,→ev e
	0
	, that is, e ev-reduces to e
	0
	in either 0 or 1 step.

	- Lemma A.5

	Assume that e1 and e
	0
	1 are two expressions in λpat such that e1 ,→ g e
	0
	1 holds. If we
	have e1 ,→ev e2 for some e2, then there exists e
	0
	2
	such that both e
	0
	1
	,→0/1
	ev e
	0
	2 and
	e2 ,→ g e
	0
	2 hold.
	Proof
	(Sketch) The proof proceeds by structural induction on the derivation D of e1 ,→ g e
	0
	1
	,
	and we present a few interesting cases as follows.
	• D is of the following form:
	e10 ,→ g e
	0
	10 ms ,→ g ms0
	case e10 of ms ,→ g case e
	0
	10 of ms0
	where e1 = case e10 of ms and e
	0
	1 = case e
	0
	10 of ms0
	. We have two subcases.
	— We have e10 ,→ev e20 for some expression e20 and e1 ,→ev e2, where e2 =
	case e20 of ms. By induction hypothesis on the derivation of e10 ,→ g e
	0
	10,
	we can find an expression e
	0
	20 such that both e
	0
	10 ,→0/1
	ev e
	0
	20 and e20 ,→ g e
	0
	20
	hold. Let e
	0
	2 be case e
	0
	20 of ms0
	, and we are done.
	— We have e1 ,→ev e2 = e1k[θ], where e10 = v for some value v, and ms =
	(p1 ⇒ e11 | · · · | pn ⇒ e1n) for some patterns p1, . . . , pn and expressions
	e11, . . . , e1n, and match(v, pk) ⇒ θ is derivable. By Proposition A.2 (2),
	we know that e
	0
	10 is in V-form (as e10 is V-form). Let v
	0 be e
	0
	10. By
	Lemma A.4, we have match(v
	0
	, pk) ⇒ θ
	0
	for some substitution θ
	0
	such that
	θ ,→ g θ
	0 holds. Note that ms0
	is of the form (p1 ⇒ e
	0
	11 | · · · | pn ⇒ e
	0
	1n
	),
	where we have e11 ,→ g e
	0
	11, . . . , e1n ,→ g e
	0
	1n
	. Let e
	0
	2 be e
	0
	1k
	[θ
	0
	]. Clearly, we
	have e
	0
	1
	,→ev e
	0
	2
	. By Proposition A.3 (2), we also have e2 ,→ g e
	0
	2
	.
	• D is of the following form
	x 6∈ FV(E) e10 ,→ g e
	0
	10 E ,→ g E0
	let x = e10 in E[x] end ,→ g E0
	[e
	0
	10]
	where e1 = let x = e10 in E[x] end and e
	0
	1 = E0
	[e
	0
	10]. We have two subcases.
	— We have e10 ,→ev e20 and e1 ,→ev e2 = let x = e20 in E[x] end. By
	induction hypothesis on the derivation of e10 ,→ g e
	0
	10, we can find an expression
	e
	0
	20 such that both e
	0
	10 ,→0/1
	ev e
	0
	20 and e20 ,→ g e
	0
	20 hold. Let e
	0
	2 be
	E0
	[e
	0
	20], and we are done.
	— We have e1 ,→ev e2 = E[v], where e10 = v for some value v. By Proposition
	A.2 (2), e
	0
	10 is a value. Let v
	0 be e
	0
	10 and e
	0
	2 = E0
	[v
	0
	]. Then we
	e
	0
	1
	,→ev e
	0
	2
	. By Proposition A.3 (1), we also have e2 ,→ g e
	0
	2
	.
	All other cases can be treated similarly.
	Lemma A.6
	Assume that e ,→ g e
	0 holds for expressions e, e
	0
	in λpat. If e ,→∗
	ev v
	∗ holds for some
	v
	∗
	in EMUV, the union of EMU and the set of observable values, then e
	0
	,→∗
	ev v
	∗
	also holds.
	Proof
	The proof proceeds by induction on n, the number of steps in e ,→∗
	ev v
	∗
	.
	• n = 0. This case immediately follows from Proposition A.2.
	• n > 0. Then we have e ,→ev e1 ,→∗
	ev v
	∗
	for some expression e1. By Lemma A.5,
	we have an expression e
	0
	1
	such that both e
	0
	,→0/1
	ev e
	0
	1
	and e1 ,→ g e
	0
	1 hold. By
	induction hypothesis, e
	0
	1
	,→∗
	ev v
	∗ holds, which implies e
	0
	,→∗
	ev v
	∗
	.
	We are now ready to present the proof of Lemma 2.14.
	Proof
	(of Lemma 2.14) In order to prove e
	0 ≤dyn e, we need to show that for any context
	G, either G[e
	0
	] ,→∗
	ev Error, or G[e
	0
	] ,→∗
	ev v
	∗
	if and only if G[e] ,→∗
	ev v
	∗
	, where v
	∗
	ranges over EMUV, that is, the union of EMU and the set of observable values.
	Let G be a context, and we have three possibilities.
	• G[e] ,→∗
	ev Error holds.
	• G[e] ,→∗
	ev v
	∗
	for some v
	∗
	in EMUV. By Lemma A.6, we have G[e
	0
	] ,→∗
	ev v
	∗
	since G[e] ,→ g G[e
	0
	] holds.
	• There exists an infinite evaluation reduction sequence from G[e] :
	G[e] = e0 ,→ev e1 ,→ev e2 ,→ev . . .
	By Lemma A.5, we have the following evaluation reduction sequence:
	G[e
	0
	] = e
	0
	0
	,→0/1
	ev e
	0
	1
	,→0/1
	ev e
	0
	2
	,→0/1
	ev . . .
	where G[e
	0
	] = e
	0
	0 and ei
	,→ g e
	0
	i
	for i = 0, 1, 2, . . .. We now need to show that
	there exist infinitely many nonempty steps in the above evaluation sequence.
	This can be done by introducing a notion of residuals of g-redexes under evreduction,
	analogous to the notion of residuals of β-redex under β-reduction
	developed in the study of pure λ-calculus (Barendregt, 1984). The situation
	here is nearly identical to the one encountered in the proof of Conservation
	Theorem (Theorem 11.3.4 (Barendregt, 1984)), and we thus omit further routine
	but rather lengthy details.
	After inspecting these three possibilities, we clearly see that this lemma holds.

- B Proof of Theorem 4.11
	
	Proof
	Let D be the typing derivation of ∅; ∅; ∅ ` e1 : τ . The proof proceeds by induction
	on the height of D. Assume that the last applied rule in D is (ty-sub). Then D is
	of the following form:
	D1 :: ∅; ∅; ∅ ` e1 : τ1 ∅; ∅ ` τ1 ≤s
	tp τ
	∅; ∅; ∅ ` e1 : τ
	(ty-sub)
	By induction hypothesis on D1, ∅; ∅; ∅ ` e2 : τ1 is derivable. Hence, ∅; ∅; ∅ ` e2 : τ
	is also derivable.

	In the rest of the proof, we assume that the last applied rule in D is not (ty-sub).
	Let e1 = E[e0] and e2 = E[e
	0
	0
	] for some evaluation context E, where e0 is a redex
	and e
	0
	0
	is the reduct of e
	0
	0
	. We proceed by analyzing the structure of E.
	As an example, let us assume that E is let x = E0 in e end for some evaluation
	context E0 and expression e. Then e1 is let x = E0[e0] in e end and the typing
	derivation D is of the following form:
	D1 :: ∅; ∅; ∅ ` E0[e0] : τ1 ∅; ∅; ∅, x : τ1 ` e : τ2
	∅; ∅; ∅ ` let x = E0[e0] in e end : τ2
	(ty-let)
	where τ2 = τ . By induction hypothesis on D1, we can derive ∅; ∅; ∅ ` E0[e
	0
	0
	] : τ1.
	Hence, we can also derive ∅; ∅; ∅ ` let x = E0[e
	0
	0
	] in e end : τ2. Note that e2 is
	let x = E0[e
	0
	0
	] in e end, and we are done.
	We skip all other cases except the most interesting one where E = [], that is,
	e1 is a redex and e2 is the reduct of e1. In this case, we proceed by inspecting the
	structure of D.
	• e1 = fst(<v1, v2>) and e2 = v1. Then D is of the following form:
	D1 :: ∅; ∅; ∅ ` <v1, v2> : τ1 ∗ τ2
	∅; ∅; ∅ ` fst(<v1, v2>) : τ1
	(ty-fst)
	where τ = τ1. By Lemma 4.6, we may assume that the last rule applied in D1
	is not (ty-sub). Hence, D1 is of the following form:
	∅; ∅; ∅ ` v1 : τ1 ∅; ∅; ∅ ` v2 : τ2
	∅; ∅; ∅ ` <v1, v2> : τ1 ∗ τ2
	(ty-prod)
	and therefore ∅; ∅; ∅ ` e2 : τ1 is derivable as e2 = v1.
	• e1 = snd(<v1, v2>) and e2 = v2. This case is symmetric to the previous one.
	• e1 = (lamx. e)(v) and e2 = e[x 7→ v]. Then D is of the following form:
	D1 :: ∅; ∅; ∅ ` lam x. e : τ1 → τ2 ∅; ∅; ∅ ` v : τ1
	∅; ∅; ∅ ` (lamx. e)(v) : τ2
	(ty-app)
	where τ = τ2. By Lemma 4.6, we may assume that the last rule applied in D1
	is not (ty-sub). Hence, D1 is of the following form
	∅; ∅; ∅, x : τ1 ` e : τ2
	∅; ∅; ∅ ` lamx. e : τ1 → τ2
	(ty-lam)
	By Lemma 4.7 (3), we know that the typing judgment ∅; ∅; ∅ ` e[x 7→ v] : τ2
	is derivable.
	• e1 = case v of ms and e2 = e[θ] for some clause p ⇒ e in ms such that
	match(v, p) ⇒ θ is derivable. Let D1, D2, D3 be derivations of ∅; ∅; ∅ ` v : τ1,
	p ↓ τ1 ⇒ (φ0; P~
	0; Γ0), and φ0; P~
	0; Γ0 ` e : τ2, respectively, where τ = τ2.
	By Lemma 4.10, we have a substitution Θ satisfying ∅ ` Θ : φ0 such that
	both ∅ |= P~
	0[Θ] and ∅ ` θ : Γ0[Θ] hold. By Lemma 4.7 (1), we know that
	∅; P~
	0[Θ]; Γ0[Θ] ` e : τ2 is derivable as τ2 contains no free occurrences of the
	index variables declared in φ0. By Lemma 4.7 (2), we know that ∅; ∅; Γ0[Θ] `
	e : τ2 is derivable. By Lemma 4.7 (3), we know that ∅; ∅; ∅ ` e[θ] : τ2 is
	derivable.
	• e1 =⊃−(⊃+(v)) for some value v. Then D is of the following form:
	D1 :: ∅; ∅; ∅ `⊃+(v) : P ⊃ τ ∅ |= P
	∅; ∅; ∅ `⊃−(⊃+(v)) : τ
	(ty-⊃-elim)
	By Lemma 4.6, we may assume that the last rule applied in D1 is not
	(ty-sub). Hence, D1 is of the following form:
	D2 :: ∅; P; ∅ ` v : τ
	∅; ∅; ∅ `⊃+(v) : P ⊃ τ
	(ty-⊃-intro)
	By Lemma 4.7 (2), the typing judgment ∅; ∅; ∅ ` v : τ is derivable. Note that
	e2 = v, and we are done.
	• e1 = Π−(Π+(v)) for some value v. Then D is of the following form:
	D1 :: ∅; ∅; ∅ ` Π
	+(v) : Πa:s. τ0 ∅ ` I : s
	∅; ∅; ∅ ` Π−(Π+(v)) : τ0[a 7→ I]
	(ty-Π-elim)
	where τ = τ0[a 7→ I]. By Lemma 4.6, we may assume that the last rule applied
	in D1 is not (ty-sub). Hence, D1 is of the following form:
	D2 :: ∅, a : s; ∅; ∅ ` v : τ0
	∅; ∅; ∅ ` Π+(v) : Πa:s. τ0
	(ty-Π-intro)
	By Lemma 4.7 (1), the typing judgment ∅; ∅; ∅ ` v : τ0[a 7→ I] is derivable.
	Note that e2 = v, and we are done.
	• e1 = let ∧(x) = ∧(v) in e end for some value v and expression e. Then D is
	of the following form:
	D1 :: ∅; ∅; ∅ ` ∧(v) : P ∧ τ1 D2 :: ∅; P; ∅, x : τ1 ` e : τ2
	∅; ∅; ∅ ` let ∧(x) = v in e end : τ2
	(ty-∧-elim)
	where τ = τ2. By Lemma 4.6, we may assume that the last rule applied in D1
	is not (ty-sub). Hence, D1 is of the following form:
	D3 :: ∅; ∅; ∅ ` v : τ1 ∅ |= P
	∅; ∅; ∅ ` ∧(v) : P ∧ τ1
	(ty-∧-intro)
	By Lemma 4.7 (2), ∅; ∅; ∅, x : τ1 ` e : τ2 is derivable, and by Lemma 4.7 (3),
	∅; ∅; ∅ ` e[x 7→ v] : τ2 is also derivable. Note that e2 = e[x 7→ v], and we are
	done.
	• e1 = let Σ(x) = Σ(v) in e end for some value v and expression e. Then D is
	of the following form:
	D1 :: ∅; ∅; ∅ ` Σ(v) : Σa:s. τ1 D2 :: ∅, a : s; ∅; ∅, x : τ1 ` e : τ2
	∅; ∅; ∅ ` let Σ(x) = v in e end : τ2
	(ty-Σ-elim)
	where τ = τ2. By Lemma 4.6, we may assume that the last rule applied in D1
	is not (ty-sub). Hence, D1 is of the following form:
	D3 :: ∅; ∅; ∅ ` v :: τ1[a 7→ I] ∅ ` I : s
	∅; ∅; ∅ ` Σ(v) : Σa:s. τ1
	(ty-Σ-intro)
	By Lemma 4.7 (1), ∅; ∅; ∅, x : τ1[a 7→ I] ` e : τ2 is derivable as τ2 contains no
	free occurrence of a. Then by Lemma 4.7 (3), ∅; ∅; ∅ ` e[x 7→ v] : τ2 is also
	derivable. Note that e2 = e[x 7→ v], and we are done.
	We thus conclude the proof of Theorem 4.11.
	
- C Proof Sketch of Theorem 6.8

	We outline in this section a proof of Theorem 6.8. Though we see no fundamental
	difficulty in handling exceptions, we will not attempt to do it here as this would
	significantly complicate the presentation of the proof.
	We first state some basic properties about typing derivations in λ
	Π,Σ
	pat extended
	with references.
	Proposition C.1
	Assume that D :: φ; P~ ; Γ `µ e : σ is derivable and there is no free occurrence of α
	in either Γ or µ. Then there is derivation of D0 of φ; P~ ; Γ `µ e : σ[α 7→ τ ] such that
	height(D) = height(D0
	) holds.
	Proof
	(Sketch) By induction on the height of D.
	Proposition C.2
	Assume that D1 : φ; P~; Γ `µ1
	e : σ is derivable and µ2 extends µ1. Then there is a
	derivation D2 of φ; P~; Γ `µ2
	e : σ such that height(D1) = height(D2) holds.
	Proof
	(Sketch) The proof proceeds by induction on the height of D1. We present the only
	interesting case in this proof, where σ = ∀α~. τ for some type τ and D1 is of the
	following form:
	D10 :: φ; P~ ; Γ `µ1
	e : τ α~ # Γ α~ # µ1 e is value-equivalent
	φ; P~ ; Γ `µ1
	e : ∀α~. τ
	(ty-poly)
	Let us choose α~
	0
	such that there is no α in α~
	0
	that has any free occurrences in Γ, τ
	or µ2. Applying Proposition C.1 (repeatedly if needed), we can obtain a derivation
	D0
	10 of φ; P~; Γ `µ1
	e : τ [α~ 7→ α~
	0
	] such that height(D10) = height(D0
	10). By induction
	hypothesis, we have a derivation D0
	20 of φ; P~ ; Γ `µ2
	e : τ [α~ 7→ α~
	0
	] such that
	height(D0
	1
	) = height(D0
	2
	). Let D2 be the following derivation:
	D0
	20 :: φ; P~ ; Γ `µ2
	e : τ [α~ 7→ α~
	0
	] α~
	0 # Γ α~
	0 # µ2 e is value-equivalent
	φ; P~ ; Γ `µ2
	e : ∀α~
	0
	. τ [α~ 7→ α~
	0
	]
	(ty-poly)
	Note that σ = ∀α~
	0
	. τ [α~ 7→ α~
	0
	], and we are done.


	The following lemma states that evaluation not involving references is typepreserving.
	
	Lemma C.3
	Assume that φ; P~; ∅ `µ e1 : σ is derivable. If e1 ,→ev e2 holds, then φ; P~ ; ∅ `µ e2 : σ
	is also derivable.

	- Proof

	(Sketch) This proof can be handled in precisely the same manner as the proof of
	Theorem 4.11 in Appendix B.
	Lemma C.3 can actually be strengthened to state that evaluation not involving
	reference creation is type-preserving.
	We are now ready to prove Theorem 6.8.

	- Proof

	(of Theorem 6.8) (Sketch) We have the following four possibilities according to the
	definition of ,→ev/st.
	• e1 ,→ev e2. This case follows from Lemma C.3 immediately.
	• e1 = E[ref(v)] for some evaluation context E and value v. This case is handled
	by analyzing the structure of E. Obviously, e1 is not value-equivalent since
	e1 ,→∗
	ev v does not hold for any value. This means that E cannot be of either
	the form ⊃+(E1) or the form Π+(E1). We encourage the reader to figure out
	what would happen if these two forms of evaluation contexts were not ruled
	out. Among the rest of the cases, the only interesting one is where E is [],
	that is, e1 = ref(v). In this case, we know that σ cannot be a type scheme
	(since e1 is not value-equivalent). Hence, σ is of the form (τ )ref for some type
	τ and ∅; ∅; ∅ `µ1
	v : τ is derivable. Also, we have M2 = M1[l 7→ v] for some
	reference constant l not in the domain of M1 and e2 = l. Let µ2 be µ1[l 7→ τ ],
	and we have M2 : µ2. Clearly, ∅; ∅; ∅ `µ2
	e2 : (τ )ref is derivable.
	• e1 = E[!l] for some evaluation context E and reference constant l. This case
	can be handled like the previous one.
	• e1 = E[l := v] for some evaluation context E, reference constant l and value
	v. This case can handled like the previous one.
	In order to fully appreciate the notion of value restriction, it is probably helpful to
	see what can happen if there is no value restriction. Assume that the constructor nil
	is given the c-type ∀α. 1 ⇒ (α)list. Clearly, we have a derivation D of the following
	judgment:
	∅; ∅; ∅ `[] ref(nil) : ((α)list)ref
	where α is some type variable. With no value restriction, the following derivation
	can be constructed
	D :: ∅; ∅; ∅ `[] ref(nil) : ((α)list)ref
	∅; ∅; ∅ `[] ref(nil) : ∀α.((α)list)ref
	Certainly, we have ([], ref(nil)) ,→ev/st ([l 7→ nil], l) for any reference constant l.
	However, there is simply no store type µ such that [l 7→ nil] : µ holds and ∅; ∅; ∅ `µ
	l : ∀α. ((α)list)ref is also derivable. For instance, let us choose µ to be [l 7→ (α)list].
	Then we can derive ∅; ∅; ∅ `µ l : ((α)list)ref, but this does not lead to a derivation
	of ∅; ∅; ∅ `µ l : ∀α. ((α)list)ref as α # µ does not hold, that is, α does have a free
	occurrence in µ. Hence, without value restriction, the theorem of subject reduction
	can no longer be established.





































































	(2) Σ;P⃗ |=S s1 →tp s2 ≤tp s′1 →tp s′2 は
	    Σ;P⃗ |=S s′1 ≤tp s1 と
	    Σ;P⃗ |=S s2 ≤tp s′2 を意味し、なおかつ

	(3) Σ; P⃗ |=S P ⊃ s ≤tp P ′ ⊃ s′ は Σ; P⃗ , P ′ |=S P と Σ; P⃗ , P ′ |=S s ≤tp s′ を意味し、なおかつ
	(4) Σ;P⃗ |=S P ∧s ≤tp P′ ∧s′ は Σ;P⃗,P |=S P′ と Σ;P⃗,P |=S s ≤tp s′ を意味し、なおかつ
	(5) Σ; P⃗ |=S ∀a : σ.s ≤tp ∀a : σ.s′ は Σ, a : σ; P⃗ |=S s ≤tp s′ を意味し、なおかつ
	(6) Σ; P⃗ |=S ∃a : σ.s ≤tp ∃a : σ.s′ は Σ, a : σ; P⃗ |=S s ≤tp s′ を意味し、なおかつ
	(7) ∅;∅ |=S scc[s1,...,sn] ≤tp scc′[s′1,...,s′n′] は scc = scc′ を意味します
