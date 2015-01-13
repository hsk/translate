- 8 Related work

	Our work falls in between full program verification, either in type theory or systems such as PVS (Owre et al., 1996), and traditional type systems for programming languages.

	When compared to verification, our system is less expressive but more automatic when constraint domains with practical constraint satisfaction problems are chosen.

	Our work can be viewed as providing a systematic and uniform language interface for a verifier intended to be used as a type system during the program development cycle.

	Since it extends ML conservatively, it can be used sparingly as existing ML programs will work as before (if there is no keyword conflict).

	Most closely related to our work is the system of indexed types developed independently by Zenger in his Ph.D.

	Thesis (Zenger, 1998) (an earlier version of which is described in (Zenger, 1997)).

	He worked in the context of lazy functional programming.

	His language is simple and clean and his applications (which significantly overlap with ours) are compelling.

	In general, his approach seems to require more changes to a given Haskell program to make it amenable to checking indexed types than is the case for our system and ML. This is particularly apparent in the case of existentially quantified dependent types, which are tied to data constructors.

	This has the advantage of a simpler algorithm for elaboration and type-checking than ours, but the program (and not just the type) has to be (much) more explicit.

	For instance, one may introduce the following datatype to represent the existentially quantified type Σa:int. int(a):

		datatype IntType = {a: int} Int of int (a)

	where the value constructor Int is assigned the c-type Πa : int. int(a) ⇒ IntType.

	If one also wants a type for natural numbers, then another datatype needs to be introduced as follows:

		datatype NatType = {a: int | a >= 0} Nat of int (a)

	where Nat is assigned the c-type ∀a : int.a ≥ 0 ⊃ (int(a) ⇒ NatType).

	If types for positive integers, negative integers, etc. are wanted, then corresponding datatypes have to be introduced accordingly. Also, one may have to define functions between these datatypes.

	For example, a function from NatType to IntType is needed to turn natural numbers into integers. At this point, we have strong doubts about the viability of such an approach to handling existentially quantified types, especially, in cases where the involved type index terms are drawn from a (rich) type index language such as Lint.

	Also, since the language in (Zenger, 1998) is pure, the issue of supporting indexed types in the presence of effects is not studied there.

	When compared to traditional type systems for programming languages, perhaps the most closely related work is refinement types (Freeman & Pfenning, 1991), which also aims at expressing and checking more properties of programs that are already well-typed in ML, rather than admitting more programs as type-correct, which is the goal of most other research studies on extending type systems.

	However, the mechanism of refinement types is quite different and incomparable in expressive power:

	While refinement types incorporate intersection and can thus ascribe multiple types to terms in a uniform way, dependent types can express properties such as “these two argument lists have the same length” which are not recognizable by tree automata (the basis for type refinements).

	In (Dunfield, 2002), dependent types as formulated in (Xi, 1998; Xi & Pfenning, 1999) are combined with refinement types via regular tree grammar (Freeman & Pfenning, 1991), and this combination shows that these two forms of types can coexist naturally.

	Subsequently, a pure type assignment system that includes intersection and dependent types, as well as union and existential types, is constructed in (Dunfield & Pfenning, 2003).

	This is a rather different approach when compared with the one presented in the paper as it does not employ elaboration as a central part of the development.

	In particular, typechecking is undecidable, and the issue of undecidable type-checking is addressed in (Dunfield & Pfenning, 2004), where a new reconstruction of the rules for indefinite types (existential, union, empty types) using evaluation contexts is given.

	This new reconstruction avoids elaboration and is decidable in theory.

	However, its effectiveness in practice is yet to be substantiated. In particular, the effectiveness of handling existential types through the use contextual type annotations in this reconstruction requires further investigation.

	Parent (Parent, 1995) proposed to reverse the process of extracting programs from constructive proofs in Coq (Dowek et al., 1993), synthesizing proof skeletons from annotated programs.

	Such proof skeletons contain “holes” corresponding to logical propositions not unlike our constraint formulas.

	In order to limit the verbosity of the required annotations, she also developed heuristics to reconstruct proofs using higher-order unification.

	Our aims and methods are similar, but much less general in the kind of specifications we can express.

	On the other hand, this allows a richer source language with fewer annotations and, in practice, avoids direct interaction with a theorem prover.

	Extended ML (Sannella & Tarlecki, 1989) is proposed as a framework for the formal development of programs in a pure fragment of Standard ML.

	The module system of Extended ML can not only declare the type of a function but also the axioms it satisfies.

	This design requires theorem proving during extended typechecking.

	In contrast, we specify and check less information about functions, thus avoiding general theorem proving.

	Cayenne (Augustsson, 1998) is a Haskell-like language in which fully dependent types are available, that is, language expressions can be used as type index objects.

	The price for this is undecidable type-checking in Cayenne.

	For instance, the printf in C, which is not directly typable in ML, can be made typable in Cayenne, and modules can be replaced with records, but the notion of datatype refinement does not exist.

	As a pure language, Cayenne also does not address issue of supporting dependent types in the presence of effects. This clearly separates our language design from that of Cayenne.

	The notion of sized types is introduced in (Hughes et al., 1996) for proving the correctness of reactive systems.

	Though there exist some similarities between sized types and datatype refinement in DML(L) for some type index language L over the domain of natural numbers, the differences are also substantial.

	We feel that the language presented in (Hughes et al., 1996) seems too restrictive for general programming as its type system can only handle (a minor variation) of primitive recursion.

	On the other hand, the use of sized types in the correctness proofs of reactive systems cannot be achieved in DML(L) at this moment.

	Jay and Sekanina (Jay & Sekanina, 1996) have introduced a technique for array bounds checking elimination based on the notion of shape types.

	Shape checking is a kind of partial evaluation and has very different characteristics and source language when compared to DML(L), where constraints are linear inequalities on integers.

	We feel that their design is more restrictive and seems more promising for languages based on iteration schema rather than general recursion.

	A crucial feature in DML(L) that does not exist in either of the above two systems is existential dependent types, or more precisely, existentially quantified dependent types, which is indispensable in our experiment.

	The work on local type inference by Pierce and Turner (Pierce & Turner, 1998), which includes some empirical studies, is also based on a similar bi-directional strategy for elaboration, although they are mostly concerned with the interaction between polymorphism and subtyping, while we are concerned with dependent types.

	This work is further extended by Odersky, Zenger and Zenger in their study on colored local type inference (Odersky et al., 2001).

	However, we emphasize that the use of constraints for index domains is quite different from the use of constraints to model subtyping constraints (see (Sulzmann et al., 1997), for example).

	Along a different but closely related line of research, a new notion of types called guarded recursive (g.r.) datatypes are introduced (Xi et al., 2003).

	Also, phantom types are studied in (Cheney & Hinze, 2003), which are largely identical to g.r.

	In ML, it is possible to implement a function similar to printf, which, instead of applying to a format string, applies to a function argument corresponding to a parsed format string.

	Please see (Danvy, 1998) for further details.
	
	datatypes. Recently, this notion of types are given the name generalized algebraic datatypes (GADTs).

	On the syntactic level, GADTs are of great similarity to universal dependent datatypes in λΠ,Σ pat , essentially using types as type indexes.

	However, unlike DML-style dependent types, ML extended with GADTs is no longer a conservative extension over ML as strictly more programs can be typed in the presence of GADTs.

	On the semantic level, g.r. datatypes are a great deal more complex than dependent types. At this moment, we are not aware of any model-theoretical explanation of GADTs.
	
	Many examples in DML(L) can also be handled in terms of GADTS. As an example, suppose we want to use types to represent natural numbers; we can introduce a type Z and a type constructor S of the kind type → type; for each natural number n, we use S n(Z) to represent n, where S n means n applications of S.

	There are some serious drawbacks with this approach.

	For instance, it cannot rule out forming a type like S(Z∗Z), which does not represent any natural number.

	More importantly, the programmer may need to supply proofs in a program in order for the program to pass type-checking (Sheard, 2004).

	There are also various studies on type inference addressing GADTs (Pottier & R´egis-Gianas, 2006; Jones et al., 2005), which are of rather different focus and style from the elaboration in Section 5.

	Noting the close resemblance between DML-style dependent types and the guarded recursive datatypes, we immediately initiated an effort to unify these two forms of types in a single framework, leading to the design and formalization of Applied Type System (ATS) (Xi, 2004).

	Compared to λΠ,Σ pat , ATS is certainly much more general and expressive, but it is also much more complicated, especially, semantically.

	For instance, unlike in λΠ,Σ pat , the definition of type equality in ATS involves impredicativity.

	In DML, we impose certain restrictions on the syntactic form of constraints so that some effective means can be found for solving constraints automatically.

	Evidently, this is a rather ad hoc design in its nature. In ATS (Xi, 2005), a language with a type system rooted in ATS, we adopt a different design.

	Instead of imposing syntactical restrictions on constraints, we provide a means for the programmer to construct proofs to attest to the validity of constraints.

	In particular, we accommodate a programming paradigm in ATS that enables the programmer to combine programming with theorem proving (Chen & Xi, 2005a).
