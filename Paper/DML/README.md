- Abstract

	We present an approach to enriching the type system of ML with a restricted form of dependent types, where type index terms are required to be drawn from a given type index language L that is completely separate from run-time programs, leading to the DML(L) language schema.

	私たちは、DMLにつながる、タイプインデックス用語がランタイムプログラムから完全に分離され、指定されたタイプのインデックス言語Lから引き出されることが要求される依存型の制限された形で、MLの型システムの充実へのアプローチを提示する（L）言語スキーマ。

	This enrichment allows for specification and inference of significantly more precise type information, facilitating program error detection and compiler optimization.

	この濃縮は、プログラムエラー検出およびコンパイラの最適化を容易にする、本明細書および著しくより正確なタイプ情報の推論を可能にする。

	The primary contribution of the paper lies in our language design, which can effectively support the use of dependent types in practical programming.

	論文の主要な貢献は、効果的に実践的なプログラミングの依存型の使用をサポートすることができる、私たちの言語設計にあります。

	In particular, this design makes it both natural and straightforward to accommodate dependent types in the presence of effects such as references and exceptions.

	特に、このデザインは、それが自然で簡単にこのような参照や例外などの効果の存在下での依存タイプに対応することができます。

- 1 Introduction

	In this paper, we report some research on supporting the use of dependent types in practical programming, drawing most of the results from (Xi, 1998).

	本稿では、実用的なプログラミングで依存型の使用をサポートしている（西、1998）からの結果のほとんどを描く上でいくつかの研究を報告している。

	We do not attempt to incorporate into this paper some recent, closely related results (e.g., guarded recursive datatypes (Xi et al., 2003), Applied Type System (Xi, 2004)), with which we only provide certain comparison.

	我々は唯一の特定の比較を提供するとともに、本論文いくつかの最近の、密接に関連した結果（例えば、保護された再帰的なデータ型（XIら、2003）、応用型システム（XI、2004））、組み込むしようとしないでください。

	Type systems for functional languages can be broadly classified into those for rich, realistic programming languages such as Standard ML (Milner et al., 1997), Objective Caml (INRIA, n.d.), or Haskell (Peyton Jones et al. , 1999), and those for small, pure languages such as the ones underlying Coq (Dowek et al., 1993), NuPrl (Constable et al. , 1986), or PX (Hayashi & Nakano, 1988).

	関数型言語の型システムは、広くそのような標準ML（ミルナーら、1997）、目的Camlのような豊かな、現実的なプログラミング言語のためのものとに分類された（INRIA、ND）、またはすることができハスケル（ペイトン·ジョーンズら、1999）、そのようなコックの基礎をなすものと小さな、純粋な言語のためのもの（Dowekら、1993）、NuPrl（巡査ら、1986）、またはPX（林·中野、1988）。

	In practical programming, type-checking should be theoretically decidable as well as practically feasible for typical programs without requiring an overwhelmingly large number of type annotations.

	実用的なプログラミングでは、型チェックは、理論的には型注釈の圧倒的多数を必要とすることなく、典型的なプログラムのための実用的に実現可能なだけでなく、決定可能べきである。

	In order to achieve this, the type systems for realistic programming languages are often relatively simple, and only relatively elementary properties　of programs can be expressed and thus checked by a type-checker.

	これを達成するために、現実的なプログラミング言語の型システムは、多くの場合、比較的簡単で、プログラムだけの比較的基本の特性を発現させることができるので、型チェッカによって確認ある。

	For instance, the error of taking the first element out of an empty list cannot be prevented by the type system of ML since it does not distinguish an empty list from a non-empty one.

	Richer type theories such as the Calculus of Inductive Constructions (underlying Coq) or Martin-L¨of type theories (underlying NuPrl) allow full specifications to be formulated, which means that type-checking becomes undecidable or requires excessively verbose type annotations.

	It also constrains the underlying functional language to remain relatively pure, so that it is possible to effectively reason about program properties within a type theory.


		datatype ’a list (int) =
		    nil(0) | {n:nat} cons(n+1) of ’a * ’a list(n)

		fun(’a)
		    append (nil, ys) = ys
		  | append (cons (x, xs), ys) = cons (x, append (xs, ys))
		withtype {m:nat,n:nat} ’a list(m) * ’a list(n) -> ’a list(m+n)

		Fig. 1. An introductory example: appending lists


	Some progress has been made towards bridging this gap, for example, by extracting Caml programs from Coq proofs, by synthesizing proof skeletons from Caml programs (Parent, 1995), or by embedding fragments of ML into NuPrl (Kreitz et al., 1998).

	In this paper, we address the issue by designing a type system for practical programming that supports a restricted form of dependent types, allowing more program invariants to be captured by types.

	We conservatively extend the type system of ML by allowing some dependencies while maintaining practical and unintrusive type-checking.

	It will be shown that a program that is typable in the extended type system is already typable in ML.

	However, the program may be assigned a more precise type in the extended type system than in ML.

	It is in this sense we refer to the extended type system as a conservative extension of ML.

	We now present a short example from our implementation before going into further details.

	A correct implementation of the append function on lists should return a list of length m + n when given two lists of length m and n, respectively.

	This property, however, cannot be captured by the type system of ML, and the inadequacy can be remedied if we introduce a restricted form of dependent types.

	The code in Figure 1 is written in the style of ML with a type annotation.

	The declared type constructor list takes a type τ and a type index n (of sort int) to form a type (τ )list(n) for lists of length n in which each element is of type τ .

	The value constructors associated with list are then assigned certain dependent types:


	- The syntax nil(0) states that the list constructor nil is assigned the type ∀α.(α)list(0), that is, nil is a list of length 0.
	- The syntax {n:nat} cons(n+1) of ’a * ’a list(n) states that the list constructor cons is assigned the following type,

			∀α.Πn:nat. α ∗ (α)list(n) → (α)list(n + 1)

		that is, cons yields a list of length n + 1 when given a pair consisting of an element and a list of length n.
		We use nat for a subset sort defined as {a : int | a ≥ 0} and the syntax {n:nat} for a universal quantifier over type index variable n of the subset sort nat.


	The withtype clause in the definition of the function append is a type annotation, which precisely states that append returns a list of length m + n when given a pair of lists of length m and n, respectively.

	The annotated type can be formally written

		fun (’a)
		    filter p [] = []
		  | filter p (x :: xs) = if p (x) then x :: filter p xs else filter p xs
		withtype {m:nat} ’a list (m) -> [n:nat | n <= m] ’a list (n)

		Fig. 2. Another introductory example: filtering lists

	as follows:


		∀α.Πm:nat.Πn:nat. (α)list(m) ∗ (α)list(n) → (α)list(m + n)

	which we often call a universal dependent type. In general, the programmer is responsible for assigning dependent types to value constructors associated with a declared datatype constructor; he or she is also responsible for providing type annotations against which programs are automatically checked.
	
	Adding dependent types to ML raises a number of theoretical and pragmatic questions.

	In particular, the kind of pure type inference in ML, which is certainly desirable in practice, becomes untenable, and a large portion of the paper is devoted to addressing various issues involved in supporting a form of partial type inference.
	
	We briefly summarize our results and design choices as follows.
	
	The first question that arises is the meaning of expressions with effects when they occur as type index terms.

	In order to avoid the difficulty, we require that type index terms be pure. In fact, our type system is parameterized over a pure type index
	language from which type index terms are drawn.

	We can maintain this purity and still make the connection to run-time values by using singleton types, such as int(n), which is the type for integer expressions of value equal to n. This is critical for practical applications such as static elimination of array bound checks (Xi & Pfenning, 1998).

	The second question is the decidability and practicality of type-checking.

	We address this in two steps: the first step is to define an explicitly typed (and unacceptably verbose) language for which type-checking is easily reduced to constraint satisfaction in some type index language L.

	The second step is to define an elaboration from DML(L), a slightly extended fragment of ML, to the fully explicitly typed language which preserves the standard operational semantics.

	The correctness of elaboration and decidability of type-checking modulo constraint satisfiability constitute the main technical contribution of this paper.

	The third question is the interface between dependently annotated and other parts of a program or a library.

	For this we use existential dependent types, although they introduce non-trivial technical complications into the elaboration procedure.

	Our experience clearly shows that existential dependent types, which are involved in nearly all the realistic examples in our experiments, are indispensable in practice.
	

		∀α.Πm:nat. (α)list(m) → Σn:{a : nat | a ≤ m}. (α)list(n)


	where {a : nat | a ≤ m} is a sort for natural numbers that are less than or equal to m.

	The type Σn:{a : nat | a ≤ m}. (α)list(n), which is for lists of length less than or equal to m, is what we call an existential dependent type. The type assigned to filter simply means that the output list returned by filter cannot be longer than the input list taken by filter.

	Without existential dependent types, in order to assign a type to filter, we may have to compute in the type system the exact length of the output list returned by filter in terms of the input list and the predicate taken by filter.

	This would most likely make the type system too complicated for practical programming.

	For instance, the function filter defined in Figure 2 is assigned the following types:

	We have so far finished developing a theoretical foundation for combining dependent types with all the major features in the core of ML, including datatype declarations, higher-order functions, general recursion, polymorphism, mutable references and exceptions.

	We have also implemented our design for a fragment of ML that encompasses all these features. In addition, we have experimented with different constraint domains and applications.

	Many non-trivial examples can be found in (Xi, 1999).

	At this point, we suggest that the reader first take a look at the examples in Section 7 so as to obtain a sense as to what can be effectively done in DML.

	In our experience, DML(L) is acceptable from the pragmatic point of view: programs can often be annotated with little internal change and type annotations are usually concise and to the point. The resulting constraint simplification problems can be solved efficiently in practice once the type index language L is properly chosen.

	Also the type annotations are mechanically verified, and therefore can be fully trusted as program documentation.

	The form of dependent types studied in this paper is substantially different from the usual form of dependent types in Martin-L¨of’s development of constructive type theory (Martin-L¨of, 1984; Martin-L¨of, 1985). In some earlier research work (Xi, 1998; Xi & Pfenning, 1999) on which this paper is largely based, the dependent types studied in this paper are called a restricted form of dependent types.

	From now on, we may also use the name DML-style dependent types to refer to such a restricted form of dependent types.

	The remainder of the paper is organized as follows. In Section 2, we present as a starting point a simply typed language λpat, which essentially extends the simply typed λ-calculus with recursion and general pattern matching.

	We then formally describe in Section 3 how type index languages can be formed.

	In particular, we explain how constraint relations can be properly defined in type index languages.

	The core of the paper lies in Section 4, where a language λΠ,Σ pat is introduced that extends λpat with both universal and existential dependent types.

	We also formally prove the subject reduction theorem and the progress theorem for λΠ,Σ pat , thus establishing the type soundness of λΠ,Σ pat .

	In Section 5, we introduce an external language DML0 designed for the programmer to construct programs that can be elaborated into λΠ,Σ pat .

	We present a set of elaboration rules and then justify these rules by proving that they preserve the dynamic semantics of programs.

	In support of the practicality of λΠ,Σ pat , we extend λΠ,Σ pat in Section 6 with parametric polymorphism (as is supported in ML), exceptions and references.

	Also, we present some interesting examples in Section 7 to give the reader a feel as to how dependent types can be

		base types δ ::= bool | int | . . .
		types τ ::= δ | 1 | τ1 ∗ τ2 | τ1 → τ2
		patterns p ::= x | f | hi | hp1, p2i | cc(p)
		matching clause seq. ms ::= (p1 ⇒ e1 | · · · | pn ⇒ en)
		constants c ::= cc | cf
		expressions e ::= xf | c(e) | hi | he1, e2i | fst(e) | snd(e) | case e of ms |
		lamx. e | e1(e2) | fix f. e | let x = e1 in e2 end
		values v ::= x | cc(v) | hi | hv1, v2i | lamx. e
		contexts Γ ::= · | Γ, xf : τ
		substitutions θ ::= [] | θ[x 7→ v] | θ[f 7→ e]

	Fig. 3. The syntax for λpat

	used in practice to capture program invariants.

	We mention some closely related work in Section 8 and then conclude.



























In this section, we show how a generic type index language L can be formed and then present some concrete examples of type index languages. 

For generality, we will include both tuples and functions in L.
However, we emphasize that a type index language can but does not necessarily have to support tuples or functions.

The generic type index language L itself is typed. In order to avoid potential confusion, we call the types in L type index sorts (or sorts, for short).


fig 7.

b: base sorts. bool or ...
C: constant sort = c-sort = (s1, . . ., sn) -> b 

We use a for index variables and C for constants, which are either constant functions or constant constructors.
Each constant is assigned a constant sort (or c-sort, for short) of the form (s1, . . . , sn) ⇒ b, which means that C(I1, . . . , In) is an index term of sort b if Ii are of sorts si for i = 1, . . . , n.


インスタンス

For instance, true and false are assigned the c-sort () ⇒ bool. We may write C for C() if C is a constant of c-sort () ⇒ b for some base sort b.

シグニチャS

We assume that the c-sorts of constants are declared in some signature S associated with L, and for each sort s, there is a constant function .=s of the c-sort (s, s) ⇒ bool.

.=

We may use .= to mean .=s for some sort s if there is no risk of confusion.

Fig 8.

We present the sorting rules for type index terms in Figure 8, which are mostly standard.
We use P for index propositions, which are index terms that can be assigned the sort bool (under some index context φ), and P~ for a sequence of propositions, where the ordering of the terms in this sequence is of no significance.

We may write φ |- P~ : bool to mean that φ |- P : bool is derivable for every P in P~.
In addition, we may use φ |- Θ : φ0 to indicate that φ |- Θ(a) : φ0(a) holds for each a in dom(Θ) = dom(φ0).



3.1 Regular constraint relation

A constraint relation φ; P~ |= P0 is defined on triples φ, P~, P0 such that both φ |-
P~ : bool and φ |- P0 : bool are derivable.


制約関係（ φ ; P 〜 | = P0 ）は３つの（ φ 、 P 〜 、 P0）で定義されており、（ φ| - 
P 〜：ブール値）と（ φ| - P0：ブール値）両方が導出可能である。

We may also write φ; P~ |= P~0 to mean that　φ; P~ |= P0 holds for each P0 in P~0.

我々はまた、（ φ ; P~ | = P~0 ）と書くことが（ φ ; P~ | = P0） ことを意味していて P~0の各P0についても同様である。

We say that a constraint relation φ; P~ |= P0 is　regular if all the regularity rules in Figure 9 are valid, that is, the conclusion of a　regularity rule holds whenever all the premises of the regularity rule do.

図9のすべての規則性の規則が有効であるか|; （ = P0 P 〜 φ ）それは、規則性ルールの結論は規則性ルールのすべての施設が行うたびに保持され、規則的である私たちは、制約関係があることを言う。

私たちは、図9のすべての規則性の規則が有効な場合、制約関係 φ; P~ |= P0 はつまり、規則性ルールの結論は規則性ルールのすべての施設が行うたびに保持され、定期的であると言う。

----------------(reg-true)
φ; P~ |= true

命題の集まりPはtrueが導出出来る。

----------------(reg-false)
φ; P~,false |= P

P~,falseは存在する。

φ; P~ |= P0
----------------(reg-var-thin)
φ,a:s; P~ |= P0


変数が加わっても同じ。


φ|- P:bool      φ;P~ |= P0
--------------------------(reg-prop-thin)
φ,a:s; P~ |= P0

Pが命題で、制約関係φでP~にP0の制約関係があるならば
変数が加わっても制約関係φでP~にP0は変わらない。


φ,a:s;P~ |= P        φ |- I:s
-----------------------------(reg-subst)
φ; P~[a |-> I ] |= P[a |-> I]

型がsの変数aが環境内にあってP~ |= Pで φ 内に変数 I:sがあるとき

φ; P~[a |-> I ] |= P[a |-> I]

命題の集合のP~内のaがIならP内のaもIだ。 


φ;P~ |= P0      φ;P~,P0 |- P1
-----------------------------(reg-cut)
φ; P~ |= P1

φ;P~ |= P0かつφ;P~,P0 |- P1ならφ; P~ |= P1だ。


Note that　the rules (reg-eq-refl), (reg-eq-symm) and (reg-eq-tran) indicate that for each　sort s,
.=s needs to be interpreted as an equivalence relation on expressions of the　sort s.

φ |- I:s
----------------(reg-eq-refl)
φ; P~ |= I .= I

反射率

φ;P~ |= I1 .= I2
----------------(reg-eq-symm)
φ;P~ |= I2 .= I1

対称律

φ;P~ |= I1 .= I2     φ;P~|= I2 .= I3
------------------------------------(reg-eq-tran)
φ; P~ |= I1 .= I3

推移律

３つまとめて、同値関係

Essentially, we want to treat a constraint relation as an abstract notion. 

However,　in order to use it, we need to specify certain properties it possesses, and this is　precisely the motivation for introducing regularity rules.

For instance, we need the regularity rules to prove the following lemma.


Lemma 3.1 (Substitution)

	• Assume φ, φ0; P~ |= P0
	     and φ |- Θ : φ0.        Then φ; P~ [Θ] |= P0[Θ] holds.
	• Assume φ; P~ , P~0 |= P0
	     and φ; P~       |= P~0. Then φ; P~     |= P0    holds.

Note that these two properties are just simple iterations of the rules (reg-subst) and (reg-cut).

In the rest of this section, we first present a model-theoretic approach to establishing the consistency of a regular constraint relation, and then show some concrete examples of type index languages.

At this point, an alternative is for the reader to proceed directly to the next section and then return at a later time.


(2) Σ;P⃗ |=S s1 →tp s2 ≤tp s′1 →tp s′2 は
    Σ;P⃗ |=S s′1 ≤tp s1 と
    Σ;P⃗ |=S s2 ≤tp s′2 を意味し、なおかつ

(3) Σ; P⃗ |=S P ⊃ s ≤tp P ′ ⊃ s′ は Σ; P⃗ , P ′ |=S P と Σ; P⃗ , P ′ |=S s ≤tp s′ を意味し、なおかつ
(4) Σ;P⃗ |=S P ∧s ≤tp P′ ∧s′ は Σ;P⃗,P |=S P′ と Σ;P⃗,P |=S s ≤tp s′ を意味し、なおかつ
(5) Σ; P⃗ |=S ∀a : σ.s ≤tp ∀a : σ.s′ は Σ, a : σ; P⃗ |=S s ≤tp s′ を意味し、なおかつ
(6) Σ; P⃗ |=S ∃a : σ.s ≤tp ∃a : σ.s′ は Σ, a : σ; P⃗ |=S s ≤tp s′ を意味し、なおかつ
(7) ∅;∅ |=S scc[s1,...,sn] ≤tp scc′[s′1,...,s′n′] は scc = scc′ を意味します













































2.2 Dynamics

	ATS の dynamics は型付き言語で、種 type の静的な項は dynamics における型です。
	動的な定数をいくつか宣言することができ、引数 n の動的な定数 dc それぞれに次の形の dc 型を割り当てることができます。

		∀a1:σ1 ... ∀ak:σk　.　P1 ⊃ (... (Pm ⊃ ([s1,...,sn]=>tp s)) ...)

		⊃      : ガード型
		P      : 命題
		[]=>tp : 型コンストラクタ

		∀a1:σ1 ... ∀ak:σk　.　P1 ⊃
		(... (Pm ⊃ ([s1,...,sn]=>tp s)) ...)
		s~ : 静的な項の (空である可能性のある) 列

	このとき s1,...,sn,s は型であると仮定しています。

	dc が動的なコンストラクタ dcc である場合、なんらかの型コンストラクタ scc について 型 s は scc[s~] の形を取れなければなりません。

	すると dcc は scc と関連があると言えるのです。

	静的な項の (空である可能性のある) 列を表わすのに s~ を使っていることに注意してください。



	例えば、次のように dc 型を割り当てることで、2つの動的なコンストラクタ nil と cons を型コンストラクタ list と関連付けることができます。

		nil: ∀a: type.list[a,0]
		cons: ∀a: type.∀n:int.n ≥ 0 ⊃ ([a,list[a,n]] =>tp [a,n+1])

	このとき、要素の型が a で長さが n のリストを表わす型として list[a, n] を使っています。 動的な値を動的な項に写像する動的な置換を ΘD で表わします。


	ΘD : 動的な置換
	dom(ΘD) : ΘDのドメイン
	Θ1D ∪ Θ2D　: Θ1D と Θ2D の和集合 (dom(Θ1D) ∩ dom(Θ2D) = ∅ となるような Θ1D と Θ2D)
	• : 任意の構文
	∀Σ.• : Σ = a1:σ1,　...,　ak:σk において、∀a1:σ1 ...　∀ak:σk.•
	P⃗ ⊃ •　: P⃗ = P1,...,Pm において P1 ⊃ (...(Pm ⊃ •)...)
	dc 型 : 常に ∀Σ.P⃗ ⊃ ([s1, . . . , sn] ⇒tp s)

	また ΘD のドメインを dom(ΘD) で表わします。静的な置換と同じように、動的な置換を形成して適用するような構文を示すことを省きます。

	dom(Θ1D) ∩ dom(Θ2D) = ∅ となるような Θ1D と Θ2D が与えられたとき、Θ1D と Θ2D の和集合を Θ1D ∪ Θ2D で表わします。

	任意の構文を • で表わすと、Σ = a1:σ1,　...,　ak:σk において、∀a1:σ1 ...　∀ak:σk.• を ∀Σ.• と書くことができます。

	同様に、P⃗ = P1,...,Pm において P1 ⊃ (...(Pm ⊃ •)...) を P⃗ ⊃ • と書くことができます。

	例えば、dc 型は常に ∀Σ.P⃗ ⊃ ([s1, . . . , sn] ⇒tp s)の形になります。

	動的な定数の宣言を許可するために、シグニチャの定義を次のように拡張する必要があります。

		signatures S ::= ... | S,dc:∀Σ.P~ ⊃ ([s1,...,sn] =>tp s)
		元は
		signatures S ::= S0 | S,sc:[σ1,...,σn] => bでこれに追加される。


	さらに、シグニチャを作るために次のような追加のルールが必要になります。

		|- S [sig]    Σ|-S P:bool  for each P in P~
		Σ |-S si:type  for each 1 ≤ i ≤ n  Σ|-S s:type
		----------------------------------------------
		|- S,dc : ∀Σ.P~ ⊃ ([s1,...,sn] =>tp s) [sig]

	動的な項の変数として x を、動的な項として d を用いるとき、dynamics の構文を図 3 に示します。

	引数の個数が n の動的な定数 dc が与えられたとき、引数 d1,...,dn への dc の適用を dc[d1,...,dn] と書きます。

	n = 0 の場合には dc[] の代わりに dc と書くこともできます。


		dyn. terms     d ::= x | dc[d1,...,dn] | lam x.d | app(d1,d2) |
		                     ⊃+(v) | ⊃-(d) | ∧(d) | let ∧(x) = d1 in d2 |
		                     ∀+(v) | ∀-(d) | ∃(d) | let ∃(x) = d1 in d2
		values         v ::= x | dcc[v1,...,vn] | lam x.d | ⊃+(v) | ∧(d) | ∀+(v) | ∃(v)
		dyn. var. ctx. Δ ::= 0 | Δ, x:s
		dyn. subst.   ΘD ::= [] | ΘD[x |-> d]

	図 3 dynamics の構文

		|-S[sig]
		------------
		Σ|-S 0[dctx]

		Σ|-S Δ[dctx]     Σ|-S s:type
		----------------------------
		Σ|-S Δ,x:s[dctx]

	図 4 動的な可変コンテキストを表わす形成ルール

	型の導出において帰納的な意味付けに必要な Lemma 3 を証明するために、標識 ⊃+ (·), ⊃− (·), ∧(·), ∀+(·), ∀−(·), ∃(·) を導入します。
	これらの標識がないと、型の導出において帰納的証明を行なうことが、著しく困難になります。
	Lemma 3 を証明することも困難になってしまうでしょう。
	Σ ⊢S ∆[dctx] の形の判定は、Σ と S の下で ∆ が well-formed な動的な可変コンテキストであることを示しています。
	このような判定を導出するルールを図 4 に示します。
	型付けされたコンテキトを Σ; P⃗ ; ∆ で表わします。
	次のルールは ⊢S Σ;P⃗;∆の形の判定を導出しています。
	これは Σ; P⃗ ; ∆ が well-formed であることを示しています。


		Σ|-S P:bool  for each P in P~    Σ|-Δ[dctx]
		-------------------------------------------
		              |-S Σ;P~;Δ

	Σ; P⃗ ; ∆ が well-formed な型付けされたコンテキストで、かつ Σ ⊢S s : type 導出できると仮定したとき、型付け判定は
	Σ; P⃗ ; ∆ ⊢S d : s の形を取ります。

	制約関係 |=S が正則であると仮定したとき、このような判定を導くための型付けルール を図 5 に示します。

	Σ ⊢S ΘS : Σ0 と書くとき、それぞれの a ∈ dom(ΘS) = dom(Σ) について Σ ⊢S ΘS(a) : Σ(a) が導出できることを意味します。

	型付けルールに関連する明らかな条件のいくつかを省略していることに注意してください。

	例えば、ルール (ty-∀-intro) を適用するとき、P⃗, ∆ もしくは s において値 a は自由に出現 (free occurrences) できません。

	また値の形に、型付けルール (ty-gua-intro) と (ty-∀-intro) の制約を付けています。

	これは後で ATS に作用を導入するための準備です。

	*2 技術的な理由で、ルール (ty-var) を次のようなルールで置き換えます。

		|- S Σ;P~;Δ
		Δ(x)=s
		Σ;P~|=S s ≤tp s'
		---------------------------------------(ty-var')
		Σ;P~;Δ|-S x:s'

	これは (ty-var) と (ty-sub) を結合しています。
	この置換は Lemma 2 成立させるために必要です。


	図 5 dynamics の型付けルール

		Σ;P~;Δ|-S d:s
		Σ;P~|=S s ≤tp s'
		---------------------------------------(ty-sub)
		Σ;P~;Δ|-S d:s'


		|-S Σ;P~;Δ
		S(dc)=∀Σ0.P~0⊃[s1,...,sn]=>tp s
		Σ|-S ΘS:Σ0
		Σ;P~|=S P[ΘS] for each P ∈ P~0
		Σ;P~;Δ|-S di:si[ΘS] for i = 1,...,n
		Σ;P~|=S s[ΘS] ≤tp s'
		------------------------------------(ty-dc)
		Σ;P~;Δ|-S dc[d1,...,dn]:s'


		|-S Σ;P~;Δ
		Δ(x)=s
		Σ;P~|=S s ≤tp s'
		-----------------(ty-var)
		Σ;P~;Δ|-S x:s'

		Σ;P~;Δ,x:s1 |- d:s2
		---------------------------------------(ty-fun-intro)
		Σ;P~;Δ|-S lam x.d : s1 ->tp s2

		Σ;P~;Δ|S d1:s1->tp s2
		Σ;P~;Δ|-S d2:s1
		----------------------------------------(ty-fun-elim)
		Σ;P~;Δ|-S app(d1,d2):s2

		Σ;P~,P;Δ|-S d:s
		----------------------------------------(ty-gua-intro)
		Σ;P~;Δ|-S ⊃+(d):P ⊃ s

		Σ;P~;Δ|-S d:P⊃s
		Σ;P~|=S P
		----------------------------------------(ty-gua-elim)
		Σ;P~;Δ|-S ⊃-(d): s

		Σ;P~|=S P
		Σ;P~;Δ|-S d:s
		----------------------------------------(ty-ass-intro)
		Σ;P~;Δ|-S ∧(d):P ∧ s

		Σ;P~;Δ|-S d1:P∧s1
		Σ;P~,P;Δ,x:s1|-S d2:s2
		--------------------------------------------(ty-ass-elim)
		Σ;P~;Δ|-S let ∧(x)=d1 in d2:s2

		Σ,a:σ;P~;Δ|-S v:s
		----------------------------------------(ty-∀-intro)
		Σ;P~;Δ|-S ∀+(v):∀a:σ.s

		Σ;P~;Δ|-S d:∀a:σ.s
		Σ|-S s0;σ
		-------------------------------(ty-∀-elim)
		Σ;P~;Δ|-S ∀-(d):s[a|->s0]

		Σ|-S s0:σ
		Σ;P~;Δ|-S d:s[a|->s0]
		---------------------------------(ty-∃-intro)
		Σ;P~;Δ|-S ∃(d):∃a:σ.s

		Σ;P~;Δ|-S d1:∃a:σ.s1
		Σ,a:σ;P~;Δ,x:s1|-S d2:s2
		-----------------------------------------------(ty-∃-elim)
		Σ;P~;Δ|-S let ∃(x) = d1 in d2:s2

	ここで、動的な項を評価するルールの表現に進む前に、ガード型とアサート型がセキュリティを強制する役割を演じるような、興味深いシナリオをスケッチしてみましょう。

	これらの型を理解をさらに容易にしてくれるはずです。



	Example 2. Secret は命題定数で、password と action が次のような dc 型が割り当てられた 2 つの関数で宣言されている、 と仮定します。

		action: Secret ⊃ [1] =>tp 1
		password: [1] =>tp Secret ∧ 1

	password を呼び出しが返る前になんらかの secret 情報を検証しなければならない、というような方法で関数 password を 実装することができます。
	一方では、関数呼び出し action[⟨⟩] をする前に、命題 Secret を成立させなければなりません。
	このとき、⟨⟩ はユニット型 1 の値を意味します。
	もう一方、関数呼び出し password[⟨⟩] が返った後では、命題 Secret は 成立しています。
	従って、action 呼び出しは次のプログラムパターンを意味していることになります:

		let ∧(x) = password[⟨⟩]in ... action[⟨⟩] ...


	特に x のスコープ外における action 呼び出しは ill-typed です。
	なぜなら命題 Secret を成立させることができないからです。
	値渡し (call-by-value) の動的な構文を動的な項に割り当てるために、次に定義する評価コンテキストを利用します:

		eval. ctx. E ::= [] | dc[v1,...,vi-1,E,di+1,...,dn]|
		                 app(E,d) | app(v,E) | ⊃-(E) | ∀-(E) |
		                 ∧(E)|let ∧(x)=E in d | ∃(E) | let ∃(x) = E in d

	Definition 2.

		簡約基 (redex) と簡約 (reducation) を次のように定義します。

		• app(lam x.d, v) は簡約基で、その簡約は d[x |-> v] です。
		• ⊃− (⊃+ (v)) は簡約基で、その簡約は v です。
		• let ∧ (x) = ∧(v)ind は簡約基で、その簡約は d[x |-> v] です。
		• ∀−(∀+(v)) は簡約基で、その簡約は v です。
		• let∃(x) = ∃(v)ind は簡約基で、その簡約は d[x |-> v] です。
		• なんらかの値 v に等しく定義された dcf [v1 , . . . , vn ] は簡約基で、その簡約は v です。

		なんらかの簡約基 d とその簡約 d′ について d1 = E[d] かつ d2 = E[d′] のような 2 つの動的な項 d1 と d2 が与えられたとき、d1 |-> d2 は 1 ステップで d1 を d2 に簡約することを意味します。
		|-> の再帰的で推移的なクロージャを |->∗ で表わします。
		それぞれの動的な関数定数 dcf に割り当てられた型が妥当であると仮定します。
		すなわち、もし ∅; ∅; ∅ ⊢S dcf [v1 , . . . , vn ] : s が導出でき、かつ dcf[v1, . . . , vn] |-> v が成立するなら、∅; ∅; ∅ ⊢S v : s が導出できるとします。
		判定 J が与えられたとき、D が J の導出であることを示すために D :: J と書きます。
		つまり D が J を結論とする導出であることを意味しています。

	Lemma 1 (Substitution).

		次が成立します。
		(1) D::Σ,a:σ;P⃗;∆⊢S d:sとD0 ::Σ⊢S s0 :σを仮定します。
			するとΣ;P⃗[a|->s0];∆[a|->s0]⊢S d:s[a|->s0]を導出できます。
		(2) D :: Σ;P⃗,P;∆ ⊢S d : s と Σ;P⃗ |=S P を仮定します。
			すると Σ;P⃗;∆ ⊢S d : s を導出できます。
		(3) D::Σ;P⃗;∆,x:s1 ⊢S d2 :s2 とΣ;P⃗;∆⊢S d1 :s1 を仮定します。
			するとΣ;P⃗;∆⊢S d2[x|->d1]:s2 を導出できます。

	Proof.

		D に関する構造帰納法を使って (1),(2),(3) を簡単に証明できます。
		(1) と (2) を証明する際、規則ルール (reg-subst) と (reg-cut) をそれぞれ利用する必要があります。
		導出 D が与えられたとき、D の高さを h(D) で表わします。
		これは一般的な方法で定義できます。

	Lemma 2.

		D :: Σ;P⃗;∆,x : s1 ⊢S d : s2 と Σ;P⃗ |=S s′1 ≤tp s1 を仮定します。
		すると h(D′) = h(D) となるような導出 D′ :: Σ;P⃗;∆,x : s′1 ⊢S d : s2 が存在します。

	Proof.

		証明は D に対する構造帰納法を使ってすぐに得られます。D に最後に適用されたルールが (ty-var’) であるよう な場合を扱うために、規則ルール (reg-trans) を使います。
		ルール (tyrule-eq) が存在するために、次の反転は一般的なものと少し異なります。

	Lemma 3 (Inversion). D :: Σ; P⃗ ; ∆ ⊢S d : s を仮定します。

		(1) もしd=lamx.d1 かつs=s1 →tp s2 ならばh(D′)≤h(D)であるような導出D′ ::Σ;P⃗;∆⊢S d:sが存在します。
			なおかつ D′ に適用された最後のルールは (ty-sub) ではありません。
		(2) もしd=⊃+ (d1)かつs=P ⊃s1 ならばh(D′)≤h(D)であるような導出D′ ::Σ;P⃗;∆⊢S d:sが存在します。
			なおかつ D′ に適用された最後のルールは (ty-sub) ではありません。
		(3) もしd=∧(d1)かつs=P∧s1 ならばh(D′)≤h(D)であるような導出D′ ::Σ;P⃗;∆⊢S d:sが存在します。
			なおかつ D′ に適用された最後のルールは (ty-sub) ではありません。
		(4) もしd=∀+(d1)かつs=∀a:σ.s1 ならばh(D′)≤h(D)であるような導出D′ ::Σ;P⃗;∆⊢S d:sが存在します。
			なおかつ D′ に適用された最後のルールは (ty-sub) ではありません。
		(5) もしd=∃(d1)かつs=∃a:σ.s1 ならばh(D′)≤h(D)であるような導出D′ ::Σ;P⃗;∆⊢S d:sが存在します。
			なおかつ D′ に適用された最後のルールは (ty-sub) ではありません。

	Proof.

		h(D) に関する帰納法を使います。特に、(1) を成立するために Lemma 2 が必要になります。
		ATS の型の健全性は次に示す 2 つの定理に基づいています。これらの証明は一般的であるため、ここでは省略します。

	Theorem 1 (Subject Reduction).

		D :: Σ;P⃗;∆ ⊢S d : s と d |-> d′ の両方を仮定します。
		すると Σ;P⃗;∆ ⊢S d : s を導出できます。

	Theorem 2 (Progress).

		D :: ∅; ∅; ∅ ⊢S d : s を仮定します。
		すると、 d は値となるか、もしくはなんらかの動的な項 d′ に ついてd|->d′ が成立するか、
		もしくはなんらかの簡約基でない動的な項dcf(v1,...,vn)についてd=E[dcf(v1,...,vn)] が成立します。
