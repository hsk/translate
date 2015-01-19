- 3 Type index language

	[](
	We are to enrich λpat with a restricted form of dependent types.
	The enrichment is to parameterize over a type index language from which type index terms are drawn.
	)

	我々は、依存型の制限された形でλpatを強化します。
	強化事項は、記述された型インデックス項から型インデックス言語上でパラメータ化することです。

		------------------------------------(reg-true)
		φ; P~ |= true
		
		------------------------------------(reg-false)
		φ; P~ , false |= P
		
		φ; P~ |= P0
		------------------------------------(reg-var-thin)
		φ, a : s; P~ |= P0
		
		φ |- P : bool φ; P~ |= P0
		------------------------------------(reg-prop-thin)
		φ; P~ , P |= P0
		
		φ, a : s; P~ |= P φ |- I : s
		------------------------------------(reg-subst)
		φ; P~ [a 7→ I] |= P[a 7→ I]
		
		φ; P~ |= P0 φ; P~ , P0 |= P1
		------------------------------------(reg-cut)
		φ; P~ |= P1
		
		φ |- I : s
		------------------------------------(reg-eq-refl)
		φ; P~ |= I .=s I
		
		φ;P~ |= I1 .=s I2
		------------------------------------(reg-eq-symm)
		φ;P~ |= I2 .=s I1

		φ; P~ |= I1 .=s I2 φ; P~ |= I2.=s I3
		------------------------------------(reg-eq-tran)
		φ; P~ |= I1 .=s I3

	[](Fig. 9. The regularity rules)
	図9. 正則ルール

	[](
	In this section, we show how a generic type index language L can be formed and then present some concrete examples of type index languages. 
	For generality, we will include both tuples and functions in L.
	However, we emphasize that a type index language can but does not necessarily have to support tuples or functions.
	)

	この章では、ジェネリック型のインデックス言語Lが形成され、次いで型インデックス言語のいくつかの具体的な例を提示する方法を示しています。
	一般性のために、我々は、Lの両方のタプルや機能が含まれます。
	しかし、我々は型インデックス言語は必ずしもタプルや機能をサポートする必要がないことを強調しています。

	----

	[](
	The generic type index language L itself is typed.
	In order to avoid potential confusion, we call the types in L type index sorts (or sorts, for short).
	We use a for index variables and C for constants, which are either constant functions or constant constructors.
	)
	ジェネリック型のインデックス言語L自体が型付けされています。
	混乱を避けるために、我々は、L型インデックスソート(略して、またはソート)内の型を呼び出します。
	我々はインデックス変数か、Cの生成ための定数関数や定数コンストラクタを使用します。
	[](
	The syntax of L is given in Figure 7.
	We use b for base sorts.
	In particular, there is a base sort bool for boolean values. 
	We use a for index variables and C for constants, which are either constant functions or constant constructors.
	)
	図7にL言語の構文を示します。
	我々は基本種にbを使います。
	具体的には、booleanの値の基本種boolがあります。
	私たちは定数関数と定数コンストラクタの定数用にインデックス変数とCを使用します。
	[](
	Each constant is assigned a constant sort (or c-sort, for short) of the form (s1, . . . , sn) ⇒ b, 
	which means that C(I1, . . . , In) is an index term of sort b if Ii are of sorts si for i = 1, . . . , n.
	)
	各定数は（s1, ..., sn) -> b の形(略して、c-sort)の 定数種が割り当てられていて、Iiがi=1,...,nでの種siの場合に、C(I1, ..., In)は種bのインデックス項であることを意味します。
	
	[](
	For instance, true and false are assigned the c-sort () ⇒ bool.
	We may write C for C() if C is a constant of c-sort () ⇒ b for some base sort b.
	We assume that the c-sorts of constants are declared in some signature S associated with L, and for each sort s, there is a constant function .=s of the c-sort (s, s) ⇒ bool.
	We may use .= to mean .=s for some sort s if there is no risk of confusion.
	)
	例えば、trueとfalseは、c-sort () -> bool が割り当てられています。
	Cがある基本種b用のc-sort () -> bの定数の場合C()をCと書きます。
	我々は定数のc-sortがLと関連づけられたあるシグニチャSで宣言されており、かつ、各種sで、定数関数 c-sort(s,s)->boolの .=sがある事を前提としています。
	我々は混乱の恐れが無い場合いくつかの種sで.=sの意味で.=を使うかもしれません。

	----

	[](
	We present the sorting rules for type index terms in Figure 8, which are mostly standard.
	We use P for index propositions, which are index terms that can be assigned the sort bool (under some index context φ), and P~ for a sequence of propositions, where the ordering of the terms in this sequence is of no significance.
	)
	我々は、図8でほとんど標準的な型インデックス項用の種付けルールを提示します。
	我々は、（いくつかのインデックスコンテキストφ下で）bool種を割り当てることができてインデックス項があるインデックス命題のためのPを使用し、シーケンス内の項の順序は重要ではない命題のシーケンスのP〜を使用します。

	----

	[](
	We may write φ |- P~ : bool to mean that φ |- P : bool is derivable for every P in P~.
	In addition, we may use φ |- Θ : φ0 to indicate that φ |- Θ(a) : φ0(a) holds for each a in dom(Θ) = dom(φ0).
	)
	我々は φ |- P : bool をP内のすべてのP〜のために導出可能ことを意味するために φ |- P~ : bool と書く事が出来ます。
	さらに、我々は φ |- Θ(a) : φ0(a)がdom(Θ) = dom(φ0)内で各aに当てはまることを示すために、 φ |- Θ : φ0 を使用できます。
